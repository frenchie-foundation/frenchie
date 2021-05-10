import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@chakra-ui/button';
import { HStack, Text } from '@chakra-ui/layout';
import { ChakraProps } from '@chakra-ui/system';
import { FaWallet } from 'react-icons/fa';
import constants from '../config/constants';
import { useContracts } from '../store/contracts';
import { useWallet } from '../store/wallet';
import { Logo } from './Logo';
import axios from 'axios';

type IWalletInfo = ChakraProps;

const WalletInfo: React.FC<IWalletInfo> = (props?: IWalletInfo) => {
  const { web3, isWeb3Enabled, enableWeb3, address } = useWallet();
  const { frenToken } = useContracts();

  const [loading, setLoading] = useState(false);
  const [frenBalance, setFrenBalance] = useState(-1);
  const [usdPrice, setUsdPrice] = useState(-1);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(
        'https://api.1inch.exchange/v3.0/56/quote?toTokenAddress=0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d&fromTokenAddress=0x13958e1eb63dfb8540eaf6ed7dcbbc1a60fd52af&amount=10000000000000000'
      );
      setUsdPrice(data.toTokenAmount / data.fromTokenAmount);
    })();
  }, []);

  const frenBalanceUsd = useMemo(() => {
    if (usdPrice !== -1 && frenBalance !== -1 && web3.utils) {
      return Number(web3.utils.fromWei(String(frenBalance))) * usdPrice;
    }
    return 0;
  }, [usdPrice, frenBalance, web3.utils]);

  const handleConnect = useCallback(async () => {
    if (!isWeb3Enabled) {
      setLoading(true);
      await enableWeb3();
      setLoading(false);
    }
  }, [enableWeb3, isWeb3Enabled]);

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
          <Logo display="inline" height={7} /> $FREN{' '}
          {Number(web3.utils.fromWei(String(frenBalance))).toLocaleString()}{' '}
          (USD {frenBalanceUsd.toLocaleString()})
        </Text>
      )}
      <Button
        bg="white"
        color={constants.colors.dark}
        leftIcon={<FaWallet color={constants.colors.dark} />}
        onClick={handleConnect}
        isLoading={loading}
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
