import BigNumber from 'bignumber.js';
import erc20 from '../../assets/contracts/erc20.json';
import masterchefABI from '../../assets/contracts/Farm.json';
import multicall from '../../utils/multicall';
import { getFrenFarm } from '../../utils/addressHelpers';
import farmsConfig from '../../config/farms';
import { QuoteToken } from '../../config/types';

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID;

const fetchFarms = async () => {
  const data = await Promise.all(
    farmsConfig.map(async (farmConfig) => {
      const lpAdress = farmConfig.lpAddresses[CHAIN_ID];
      const calls = [
        // Balance of token in the LP contract
        {
          address: farmConfig.tokenAddresses[CHAIN_ID],
          name: 'balanceOf',
          params: [lpAdress],
        },
        // Balance of quote token on LP contract
        {
          address: farmConfig.quoteTokenAdresses[CHAIN_ID],
          name: 'balanceOf',
          params: [lpAdress],
        },
        // Balance of LP tokens in the master chef contract
        {
          address: farmConfig.isTokenOnly ? farmConfig.tokenAddresses[CHAIN_ID] : lpAdress,
          name: 'balanceOf',
          params: [getFrenFarm()],
        },
        // Total supply of LP tokens
        {
          address: lpAdress,
          name: 'totalSupply',
        },
        // Token decimals
        {
          address: farmConfig.tokenAddresses[CHAIN_ID],
          name: 'decimals',
        },
        // Quote token decimals
        {
          address: farmConfig.quoteTokenAdresses[CHAIN_ID],
          name: 'decimals',
        },
      ];
      const [
        tokenBalanceLP,
        quoteTokenBlanceLP,
        lpTokenBalanceMC,
        lpTotalSupply,
        tokenDecimals,
        quoteTokenDecimals,
      ] = await multicall(erc20, calls);
      let tokenAmount;
      let lpTotalInQuoteToken;
      let tokenPriceVsQuote;
      if (farmConfig.isTokenOnly) {
        tokenAmount = new BigNumber(lpTokenBalanceMC).div(new BigNumber(10).pow(tokenDecimals));
        if (farmConfig.tokenSymbol === QuoteToken.BUSD && farmConfig.quoteTokenSymbol === QuoteToken.BUSD) {
          tokenPriceVsQuote = new BigNumber(1);
          // console.log(`${farmConfig.lpSymbol} is busd`)
        } else {
          // console.log(`${farmConfig.lpSymbol} is not busd ${lpAdress} quoteTokenBlancelP is ${quoteTokenBlanceLP} and tokenBalanceLP=${tokenBalanceLP}`)
          tokenPriceVsQuote = new BigNumber(quoteTokenBlanceLP).div(new BigNumber(tokenBalanceLP));
        }
        lpTotalInQuoteToken = tokenAmount.times(tokenPriceVsQuote);

        // console.log(`${farmConfig.lpSymbol} is lpTotalInQuoteToken is ${lpTotalInQuoteToken} with tokenAmount ${tokenAmount} and tokenPriceVsQuote=${tokenPriceVsQuote} `)
      } else {
        // Ratio in % a LP tokens that are in staking, vs the total number in circulation
        const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(new BigNumber(lpTotalSupply));

        // Total value in staking in quote token value
        lpTotalInQuoteToken = new BigNumber(quoteTokenBlanceLP)
          .div(new BigNumber(10).pow(18))
          .times(new BigNumber(2))
          .times(lpTokenRatio);

        // Amount of token in the LP that are considered staking (i.e amount of token * lp ratio)
        tokenAmount = new BigNumber(tokenBalanceLP).div(new BigNumber(10).pow(tokenDecimals)).times(lpTokenRatio);

        const quoteTokenAmount = new BigNumber(quoteTokenBlanceLP)
          .div(new BigNumber(10).pow(quoteTokenDecimals))
          .times(lpTokenRatio);

        if (tokenAmount.comparedTo(0) > 0) {
          tokenPriceVsQuote = quoteTokenAmount.div(tokenAmount);
        } else {
          tokenPriceVsQuote = new BigNumber(quoteTokenBlanceLP).div(new BigNumber(tokenBalanceLP));
        }
      }

      // console.log(`tokenAmount for ${farmConfig.lpSymbol} is ${tokenAmount} and quoteTokenAmount is ${quoteTokenAmount} and tokenPriceVsQuote is ${tokenPriceVsQuote}`)
      // console.log(`tokenAmount for ${farmConfig.lpSymbol} is ${tokenAmount} and tokenPriceVsQuote is ${tokenPriceVsQuote}`)

      const [info, totalAllocPoint, poolInfo, dinoPerBlock] = await multicall(masterchefABI, [
        {
          address: getFrenFarm(),
          name: 'poolInfo',
          params: [farmConfig.pid],
        },
        {
          address: getFrenFarm(),
          name: 'totalAllocPoint',
        },
        {
          address: getFrenFarm(),
          name: 'poolInfo',
          params: [farmConfig.pid],
        },
        {
          address: getFrenFarm(),
          name: 'rewardsPerBlock',
        },
      ]);

      const allocPoint = new BigNumber(info.allocPoint._hex);
      const poolWeight = allocPoint.div(new BigNumber(totalAllocPoint));
      return {
        ...farmConfig,
        tokenAmount: tokenAmount.toJSON(),
        // quoteTokenAmount: quoteTokenAmount,
        lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
        tokenPriceVsQuote: tokenPriceVsQuote.toJSON(),
        poolWeight: poolWeight.toNumber(),
        multiplier: `${allocPoint.div(100).toString()}X`,
        depositFeeBP: poolInfo.depositFeeBP,
        dinoPerBlock: new BigNumber(dinoPerBlock).toNumber(),
      };
    }),
  );
  return data;
};

export default fetchFarms;