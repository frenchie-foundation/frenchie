import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@chakra-ui/button';
import { HStack, Text } from '@chakra-ui/layout';
import { ChakraProps } from '@chakra-ui/system';
import { FaWallet } from 'react-icons/fa';
import constants from '../config/constants';
import { useContracts } from '../store/contracts';
import { useWallet } from '../store/wallet';
import { Logo } from './Logo';
import BigNumber from 'bignumber.js';

type IWalletInfo = ChakraProps;

const WalletInfo: React.FC<IWalletInfo> = (props?: IWalletInfo) => {
  const { web3, isWeb3Enabled, handleOpenWalletConnection, address } =
    useWallet();
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

  const handleConnect = useCallback(async () => {
    if (!isWeb3Enabled) {
      handleOpenWalletConnection();
    }
  }, [handleOpenWalletConnection, isWeb3Enabled]);

  useEffect(() => {
    (async () => {
      if (frenToken && address) {
        const balance = await frenToken.methods.balanceOf(address).call();
        setFrenBalance(balance);
      }
    })();
  }, [frenToken, address]);

  return (
    <HStack spacing={4} {...props}>
      {isWeb3Enabled && frenBalance !== -1 && (
        <Text fontWeight="bold" display="flex" alignItems="center">
          <Logo display="inline" height={7} />$
          {Number(web3.utils.fromWei(String(frenBalance))).toLocaleString()} (≈
          ${frenBalanceUsd.toLocaleString()})
        </Text>
      )}
      <Button
        bg="white"
        color={constants.colors.dark}
        leftIcon={<FaWallet color={constants.colors.dark} />}
        onClick={handleConnect}
        display={{ base: isWeb3Enabled ? 'none' : 'flex', md: 'flex' }}
      >
        {isWeb3Enabled
          ? `${address?.substr(0, 4)}...${address?.substr(-4, 4)}`
          : 'Connect'}
      </Button>
    </HStack>
  );
};

export default WalletInfo;
