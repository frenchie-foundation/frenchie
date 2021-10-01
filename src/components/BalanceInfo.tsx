import React, { useEffect, useMemo, useState } from 'react';
import { Box, Flex, Text } from '@chakra-ui/layout';
import { ChakraProps } from '@chakra-ui/system';
import constants from '../config/constants';
import { useContracts } from '../store/contracts';
import { useWallet } from '../store/wallet';
import BigNumber from 'bignumber.js';
import Title from '../components/Title';

type IBalanceInfo = ChakraProps;

const BalanceInfo: React.FC<IBalanceInfo> = (props?: IBalanceInfo) => {
  const { web3, isWeb3Enabled, address } = useWallet();
  const { frenToken, pancakeRouter } = useContracts();

  const [frenBalance, setFrenBalance] = useState(-1);
  const [usdPrice, setUsdPrice] = useState(-1);

  useEffect(() => {
    (async () => {
      if (pancakeRouter) {
        const amounts = await pancakeRouter.methods
          .getAmountsOut(new BigNumber(1e18).toString(), [
            constants.tokenAddress,
            constants.bnbAddress,
            constants.usdtAddress,
          ])
          .call();

        const [, , usdtPrice] = amounts;

        setUsdPrice(new BigNumber(usdtPrice).multipliedBy(1e-18).toNumber());
      }
    })();
  }, [pancakeRouter]);

  const frenBalanceUsd = useMemo(() => {
    if (usdPrice !== -1 && frenBalance !== -1 && web3.utils) {
      return Number(web3.utils.fromWei(String(frenBalance))) * usdPrice;
    }
    return 0;
  }, [usdPrice, frenBalance, web3.utils]);

  useEffect(() => {
    (async () => {
      if (frenToken && address) {
        const balance = await frenToken.methods.balanceOf(address).call();
        setFrenBalance(balance);
      }
    })();
  }, [frenToken, address]);

  return (
    <Flex
      justifyContent="space-between"
      w="100%"
      gridGap={4}
      flexDir={{ base: 'column', md: 'row' }}
    >
      <Box
        gridGap={4}
        {...props}
        p={3}
        bgColor="gray.900"
        borderRadius={8}
        boxShadow="md"
        w="100%"
      >
        <Title mb={0}>Balance in FREN</Title>
        <Text>
          {isWeb3Enabled && frenBalance !== -1
            ? Number(web3.utils.fromWei(String(frenBalance))).toLocaleString()
            : '≈ $0'}
        </Text>
      </Box>
      <Box
        gridGap={4}
        {...props}
        p={3}
        bgColor="gray.900"
        borderRadius={8}
        boxShadow="md"
        w="100%"
      >
        <Title mb={0}>Balance in USD</Title>
        <Text>≈ ${frenBalanceUsd.toLocaleString()}</Text>
      </Box>
    </Flex>
  );
};

export default BalanceInfo;
