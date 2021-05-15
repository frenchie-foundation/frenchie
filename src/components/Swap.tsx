import React, { useCallback, useEffect, useMemo, useState } from 'react';

import BigNumber from 'bignumber.js';
import { Button, IconButton } from '@chakra-ui/button';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { useDisclosure } from '@chakra-ui/hooks';
import { Box, Flex, HStack, Text } from '@chakra-ui/layout';
import { Modal, ModalBody, ModalContent, ModalOverlay } from '@chakra-ui/modal';
import { NumberInput, NumberInputField } from '@chakra-ui/number-input';
import { SelectField } from '@chakra-ui/select';
import { ChakraProps } from '@chakra-ui/system';
import { FaChevronDown, FaCog, FaExchangeAlt, FaTimes } from 'react-icons/fa';

import constants from '../config/constants';
import { useContracts } from '../store/contracts';
import { useWallet } from '../store/wallet';
import Title from './Title';
import WhiteBox from './WhiteBox';
import { Image } from '@chakra-ui/image';

interface IToken {
  symbol: string;
  address: string;
}

const tokens: IToken[] = [
  {
    symbol: 'FREN',
    address: constants.tokenAddress,
  },
  {
    symbol: 'BNB',
    address: constants.bnbAddress,
  },
  {
    symbol: 'USDT',
    address: constants.usdtAddress,
  },
  {
    symbol: 'BUSD',
    address: constants.busdAddress,
  },
];

interface ICoinLabel {
  token: IToken;
}

const CoinLabel: React.FC<ICoinLabel> = ({ token }: ICoinLabel) => {
  return (
    <HStack spacing={2}>
      <Image
        height={6}
        src={`https://tokens.1inch.exchange/${token.address}.png`}
      />
      <Text>{token.symbol}</Text>
      <FaChevronDown />
    </HStack>
  );
};

const Swap: React.FC<ChakraProps> = ({ ...props }: ChakraProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isWeb3Enabled, address } = useWallet();
  const { oneInchRouter, erc20 } = useContracts();

  const [srcToken, setSrcToken] = useState(tokens[1]);
  const [dstToken, setDstToken] = useState(tokens[0]);
  const [srcBalance, setSrcBalance] = useState(new BigNumber(0));
  const [dstBalance, setDstBalance] = useState(new BigNumber(0));
  const [srcAllowance, setSrcAllowance] = useState<BigNumber>();
  const [dstAllowance, setDstAllowance] = useState<BigNumber>();
  const [price, setPrice] = useState<BigNumber>();
  const [slippage, setSlippage] = useState(0.6);

  useEffect(() => {
    if (!address || !isWeb3Enabled) {
      return;
    }
    (async () => {
      const x = await erc20(srcToken.address)
        ?.methods.balanceOf(address)
        .call();
      setSrcBalance(x);
    })();

    (async () => {
      const x = await erc20(dstToken.address)
        ?.methods.balanceOf(address)
        .call();
      setDstBalance(x);
    })();
  }, [srcToken, dstToken, erc20, address, isWeb3Enabled]);

  useEffect(() => {
    if (!address || !isWeb3Enabled) {
      return;
    }
    (async () => {
      if (srcToken.address === constants.bnbAddress) {
        return new BigNumber(Number.POSITIVE_INFINITY);
      }
      const allowance = await erc20(srcToken.address)
        ?.methods.allowance(address, constants.oneInchRouterAddress)
        .call();
      setSrcAllowance(allowance);
    })();
  }, [address, erc20, isWeb3Enabled, srcToken]);

  useEffect(() => {
    if (!address || !isWeb3Enabled) {
      return;
    }
    (async () => {
      const allowance = await erc20(dstToken.address)
        ?.methods.allowance(address, constants.oneInchRouterAddress)
        .call();
      setDstAllowance(allowance);
    })();
  }, [address, dstToken, erc20, isWeb3Enabled, srcToken]);

  const handleTokensSwitch = useCallback(() => {
    const [x, y] = [srcToken, dstToken];
    setSrcToken(y);
    setDstToken(x);
  }, [dstToken, srcToken]);

  const handleSwap = useCallback(async () => {
    if (!isWeb3Enabled) {
      return;
    }
  }, [isWeb3Enabled]);

  return (
    <>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <Flex p={4} justifyContent="space-between" alignItems="center">
            <Title>Settings</Title>
            <IconButton
              aria-label="close"
              icon={<FaTimes />}
              onClick={onClose}
            />
          </Flex>
          <ModalBody></ModalBody>
        </ModalContent>
      </Modal>
      <WhiteBox maxWidth="100%" width="600px" {...props}>
        <Flex alignItems="center" justifyContent="space-between">
          <Title mb={0} color={constants.colors.dark}>
            Swap
          </Title>
          <IconButton aria-label="settings" icon={<FaCog />} onClick={onOpen} />
        </Flex>
        <Box
          mt={4}
          mb={4}
          borderWidth="1px"
          borderColor="gray.400"
          p={4}
          borderRadius="lg"
        >
          <FormControl position="relative" id="amountFrom" mb={2}>
            <FormLabel>From</FormLabel>
            <Text position="absolute" right={0} top={0} color="black">
              Balance: {srcBalance?.toString()}
            </Text>
            <NumberInput size="lg" position="relative">
              <NumberInputField
                placeholder="0.0"
                bg={constants.colors.dark}
                color="white"
              />
              <Button
                position="absolute"
                right="1"
                top="1"
                colorScheme="gray"
                color="white"
                zIndex={999}
              >
                <CoinLabel token={srcToken} />
              </Button>
            </NumberInput>
          </FormControl>
        </Box>
        <Flex justifyContent="center">
          <IconButton
            aria-label="switch"
            onClick={handleTokensSwitch}
            icon={<FaExchangeAlt style={{ transform: 'rotate(90deg)' }} />}
          />
        </Flex>
        <Box
          mt={4}
          borderWidth="1px"
          borderColor="gray.400"
          p={4}
          borderRadius="lg"
        >
          <FormControl position="relative" id="amountTo" mb={2}>
            <FormLabel>To</FormLabel>
            <Text position="absolute" right={0} top={0} color="black">
              Balance: {dstBalance?.toString()}
            </Text>
            <NumberInput size="lg" position="relative">
              <NumberInputField
                placeholder="0.0"
                bg={constants.colors.dark}
                color="white"
              />
              <Button
                position="absolute"
                right="1"
                top="1"
                colorScheme="gray"
                color="white"
                zIndex={999}
              >
                <CoinLabel token={dstToken} />
              </Button>
            </NumberInput>
          </FormControl>
        </Box>
        <Button
          onClick={handleSwap}
          isFullWidth
          size="lg"
          mt={4}
          colorScheme="teal"
        >
          Swap
        </Button>
      </WhiteBox>
    </>
  );
};

export default Swap;
