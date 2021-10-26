import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Image } from '@chakra-ui/react';
import { Button } from '@chakra-ui/button';
import { Box, Flex, Text } from '@chakra-ui/layout';
import { ChakraProps } from '@chakra-ui/system';
import { FaWallet } from 'react-icons/fa';
import constants from '../config/constants';
import { useContracts } from '../store/contracts';
import { useWallet } from '../store/wallet';
import { Logo } from './Logo';
import BigNumber from 'bignumber.js';
import {
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useClipboard,
  useDisclosure,
} from '@chakra-ui/react';
import { FaRegCopy, FaBook, FaSignOutAlt } from 'react-icons/fa';
import millify from '../utils/millify';
import { openInNewTab } from '../helpers/openInNewTab';
import frenLogo from '../assets/images/logo.svg';


type IWalletInfo = ChakraProps;

const WalletInfo: React.FC<IWalletInfo> = (props?: IWalletInfo) => {
  const {
    web3,
    isWeb3Enabled,
    handleOpenWalletConnection,
    address,
    disconnect,
    addFren
  } = useWallet();

  const { frenToken, pancakeRouter } = useContracts();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { onCopy } = useClipboard(address ? address : '');

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

  const handleTransactionHistoryClick = useCallback(async () => {
    openInNewTab(`https://bscscan.com/address/${address}`);
  }, [address]);

  useEffect(() => {
    (async () => {
      if (frenToken && address) {
        const balance = await frenToken.methods.balanceOf(address).call();
        setFrenBalance(balance);
      }
    })();
  }, [frenToken, address]);

  return (
    <>
      <Flex
        gridGap={4}
        {...props}
        p={3}
        bgColor="gray.900"
        mr={{ base: 4, md: 0 }}
        borderRadius={8}
        boxShadow="md"
        cursor="pointer"
        onClick={() => {
          if (isWeb3Enabled && frenBalance) onOpen();
        }}
      >
        {isWeb3Enabled && frenBalance !== -1 && (
          <Flex alignItems="center" justifyContent="space-between" gridGap={4}>
            <Logo display="inline" height={7} />
            <Flex
              flexDir={{ base: 'column', md: 'row' }}
              gridGap={{ base: 0, md: 2 }}
            >
              <Text fontWeight="bold">
                {Number(
                  web3.utils.fromWei(String(frenBalance))
                ).toLocaleString()}{' '}
              </Text>
              <Text fontWeight="bold" w="100%" textAlign="right">
                (≈ ${frenBalanceUsd.toLocaleString()})
              </Text>
            </Flex>
          </Flex>
        )}
        <Button
          bg="white"
          color={constants.colors.dark}
          leftIcon={<FaWallet color={constants.colors.dark} />}
          onClick={handleConnect}
          display={{ base: isWeb3Enabled ? 'none' : 'flex', md: 'flex' }}
          _hover={{
            bg: 'white',
            opacity: '0.7',
          }}
        >
          {isWeb3Enabled
            ? `${address?.substr(0, 4)}...${address?.substr(-4, 4)}`
            : 'Connect Your Wallet'}
        </Button>
      </Flex>
      <Modal
        motionPreset="slideInBottom"
        onClose={onClose}
        isOpen={isOpen}
        isCentered
        size="xl"
      >
        <ModalOverlay />
        <ModalContent pb={5}>
          <ModalHeader>Account</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex
              justifyContent="space-between"
              bgColor="gray.900"
              p={4}
              borderRadius={8}
              gridGap={4}
            >
              <Box gridGap={2}>
                <Text fontSize="sm">Balance</Text>
                {isWeb3Enabled && frenBalance !== -1 && (
                  <Text fontSize="lg">
                    {millify(new BigNumber(frenBalance).multipliedBy(1e-18))}{' '}
                    FREN
                  </Text>
                )}
              </Box>
              <Box>
                <Text fontSize="sm">Network</Text>
                <Text fontSize="lg">Binance Smart Chain</Text>
              </Box>
              <Box>
                <Text fontSize="sm">Wallet</Text>
                <Text fontSize="lg">Metamask</Text>
              </Box>
            </Flex>
            <Flex
              mt={4}
              p={4}
              borderRadius={8}
              backgroundColor={constants.colors.white}
              color={constants.colors.dark}
              flexDir="column"
            >
              <Text fontSize="sm" color={constants.colors.dark}>
                Address
              </Text>
              <Text
                fontSize="lg"
                color={constants.colors.dark}
                display={{ base: 'flex', md: 'none' }}
              >
                {address &&
                  `${address?.substr(0, 12)}...${address?.substr(-12, 12)}`}
              </Text>
              <Text
                fontSize="lg"
                color={constants.colors.dark}
                display={{ base: 'none', md: 'flex' }}
              >
                {address && address}
              </Text>
            </Flex>
            <Flex
              mt={4}
              justifyContent="space-between"
              gridGap={{ base: 2, sm: 4 }}
              flexDir={{ base: 'column', sm: 'row' }}
            >
              <Button
                d="flex"
                leftIcon={<Icon as={FaRegCopy} w={4} h={4} />}
                onClick={onCopy}
              >
                Copy Address
              </Button>
              <Button
                d="flex"
                leftIcon={<Icon as={FaBook} w={4} h={4} />}
                onClick={handleTransactionHistoryClick}
              >
                Transaction History
              </Button>

              <Button
                d="flex"
                leftIcon={<Icon as={FaSignOutAlt} w={4} h={4} />}
                onClick={() => {
                  disconnect();
                  onClose();
                }}
              >
                Disconnect
              </Button>
            </Flex>
            <Flex mt={4}>
              <Button
                d="flex"
                w="100%"
                onClick={() => {
                  addFren(),
                    onClose();
                }}
              >
                <Image src={frenLogo} w={6} h={6} mr={2} alt="FREN Logo" />
                Add FREN to MetaMask
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default WalletInfo;
