import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@chakra-ui/button';
import { HStack, Text } from '@chakra-ui/layout';
import { ChakraProps } from '@chakra-ui/system';
import { FaWallet } from 'react-icons/fa';
import constants from '../config/constants';
import { useContracts } from '../store/contracts';
import { useWallet } from '../store/wallet';

type IWalletInfo = ChakraProps;

const WalletInfo: React.FC<IWalletInfo> = (props?: IWalletInfo) => {
  const { web3, isWeb3Enabled, enableWeb3, address } = useWallet();
  const { frenToken } = useContracts();

  const [loading, setLoading] = useState(false);
  const [frenBalance, setFrenBalance] = useState(-1);

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
        <Text fontWeight="bold">
          $ {Number(web3.utils.fromWei(String(frenBalance))).toLocaleString()}
        </Text>
      )}
      <Button
        bg="white"
        color={constants.colors.dark}
        leftIcon={<FaWallet color={constants.colors.dark} />}
        onClick={handleConnect}
        isLoading={loading}
        display={{ base: isWeb3Enabled ? 'none' : 'block', md: 'block' }}
      >
        {isWeb3Enabled
          ? `${address?.substr(0, 4)}...${address?.substr(-4, 4)}`
          : 'Connect'}
      </Button>
    </HStack>
  );
};

export default WalletInfo;
