import BigNumber from 'bignumber.js';
import erc20ABI from '../../assets/contracts/erc20.json';
import masterchefABI from '../../assets/contracts/Farm.json';
import multicall from '../../utils/multicall';
import farmsConfig from '../../config/farms';
import { getFrenFarm } from '../../utils/addressHelpers';

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID;

export const fetchFarmUserAllowances = async (account: string) => {
  const frenFarmAdress = getFrenFarm();

  const calls = farmsConfig.map((farm) => {
    const lpContractAddress = farm.isTokenOnly ? farm.tokenAddresses[CHAIN_ID] : farm.lpAddresses[CHAIN_ID];
    return { address: lpContractAddress, name: 'allowance', params: [account, frenFarmAdress] };
  });

  const rawLpAllowances = await multicall(erc20ABI, calls);
  const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON();
  });
  return parsedLpAllowances;
};

export const fetchFarmUserTokenBalances = async (account: string) => {
  const calls = farmsConfig.map((farm) => {
    const lpContractAddress = farm.isTokenOnly ? farm.tokenAddresses[CHAIN_ID] : farm.lpAddresses[CHAIN_ID];
    return {
      address: lpContractAddress,
      name: 'balanceOf',
      params: [account],
    };
  });

  const rawTokenBalances = await multicall(erc20ABI, calls);
  const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
    return new BigNumber(tokenBalance).toJSON();
  });
  return parsedTokenBalances;
};

export const fetchFarmUserStakedBalances = async (account: string) => {
  const getFrenFarmAddresses = getFrenFarm();

  const calls = farmsConfig.map((farm) => {
    return {
      address: getFrenFarmAddresses,
      name: 'userInfo',
      params: [farm.pid, account],
    };
  });

  const rawStakedBalances = await multicall(masterchefABI, calls);
  const parsedStakedBalances = rawStakedBalances.map((stakedBalance) => {
    return new BigNumber(stakedBalance[0]._hex).toJSON();
  });
  return parsedStakedBalances;
};

export const fetchFarmUserEarnings = async (account: string) => {
  const getFrenFarmAddresses = getFrenFarm();

  const calls = farmsConfig.map((farm) => {
    return {
      address: getFrenFarmAddresses,
      name: 'pendingRewards',
      params: [farm.pid, account],
    };
  });

  const rawEarnings = await multicall(masterchefABI, calls);
  const parsedEarnings = rawEarnings.map((earnings) => {
    return new BigNumber(earnings).toJSON();
  });
  return parsedEarnings;
};