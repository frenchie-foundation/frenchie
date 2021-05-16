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
import axios from 'axios';
import { useToast } from '@chakra-ui/toast';

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
  const { isWeb3Enabled, address, web3 } = useWallet();
  const { oneInchRouter, erc20 } = useContracts();
  const toast = useToast();

  const [srcToken, setSrcToken] = useState(tokens[1]);
  const [dstToken, setDstToken] = useState(tokens[0]);
  const [srcBalance, setSrcBalance] = useState(new BigNumber(0));
  const [dstBalance, setDstBalance] = useState(new BigNumber(0));
  const [srcAllowance, setSrcAllowance] = useState<BigNumber>(new BigNumber(0));
  const [fromAmount, setFromAmount] = useState(0);
  const [toAmount, setToAmount] = useState(0);
  const [slippage, setSlippage] = useState(1);
  const [swapping, setSwapping] = useState(false);

  const fromAmountWei = useMemo(() => {
    return new BigNumber(fromAmount).multipliedBy(new BigNumber(1e18));
  }, [fromAmount]);

  const toAmountWei = useMemo(() => {
    return new BigNumber(toAmount).multipliedBy(new BigNumber(1e-18));
  }, [toAmount]);

  const displaySrcBalance = useMemo(() => {
    return srcBalance.multipliedBy(new BigNumber(1e-18)).toFixed(4);
  }, [srcBalance]);

  const displayDstBalance = useMemo(() => {
    return dstBalance.multipliedBy(new BigNumber(1e-18)).toFixed(4);
  }, [dstBalance]);

  const swapButtonText = useMemo(() => {
    if (
      fromAmountWei.isGreaterThan(srcAllowance) ||
      srcAllowance.isEqualTo(0)
    ) {
      return `Approve ${srcToken.symbol}`;
    }
    return 'Swap';
  }, [fromAmountWei, srcAllowance, srcToken.symbol]);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(
        'https://api.1inch.exchange/v3.0/56/quote',
        {
          params: {
            fromTokenAddress: srcToken.address,
            toTokenAddress: dstToken.address,
            amount: fromAmountWei.toString(),
          },
        }
      );
      setToAmount(
        new BigNumber(data.toTokenAmount)
          .multipliedBy(new BigNumber(1e-18))
          .toNumber()
      );
    })();
  }, [dstToken.address, fromAmount, fromAmountWei, srcToken.address]);

  useEffect(() => {
    if (!address || !isWeb3Enabled) {
      return;
    }
    (async () => {
      if (srcToken.address === constants.bnbAddress) {
        const x = await web3.eth.getBalance(address);
        setSrcBalance(new BigNumber(x));
        return;
      }
      const x = await erc20(srcToken.address)
        ?.methods.balanceOf(address)
        .call();
      setSrcBalance(new BigNumber(x));
    })();

    (async () => {
      if (dstToken.address === constants.bnbAddress) {
        const x = await web3.eth.getBalance(address);
        setDstBalance(new BigNumber(x));
        return;
      }
      const x = await erc20(dstToken.address)
        ?.methods.balanceOf(address)
        .call();
      setDstBalance(new BigNumber(x));
    })();
  }, [srcToken, dstToken, erc20, address, isWeb3Enabled, web3.eth]);

  useEffect(() => {
    if (!address || !isWeb3Enabled || !srcToken.address) {
      return;
    }
    (async () => {
      if (srcToken.address === constants.bnbAddress) {
        setSrcAllowance(new BigNumber('9'.repeat(64)));
        return;
      }
      const allowance = await erc20(srcToken.address)
        ?.methods.allowance(address, constants.oneInchRouterAddress)
        .call();
      setSrcAllowance(new BigNumber(allowance));
    })();
  }, [address, erc20, isWeb3Enabled, srcToken]);

  const handleTokensSwitch = useCallback(() => {
    const [x, y, f, t] = [srcToken, dstToken, fromAmount, toAmount];
    setSrcToken(y);
    setDstToken(x);
    setFromAmount(t);
    setToAmount(f);
  }, [dstToken, fromAmount, srcToken, toAmount]);

  const handleSwap = useCallback(async () => {
    if (!isWeb3Enabled || !oneInchRouter) {
      return;
    }

    setSwapping(true);

    try {
      if (!fromAmountWei.isGreaterThan(srcAllowance)) {
        console.log(srcAllowance.toString());
        const approved = await erc20(srcToken.address)
          ?.methods.approve(constants.oneInchRouterAddress, '9'.repeat(64))
          .send({
            from: address,
          });
        setSrcAllowance(new BigNumber('9'.repeat(64)));

        if (approved) {
          toast({
            status: 'success',
            description: 'Amount successfully approved. Now you can swap!',
            title: 'Success',
            position: 'top',
            duration: 5000,
          });
        }

        return;
      }
    } catch (error) {
      toast({
        status: 'error',
        description: error.message,
        title: 'Error',
        position: 'top',
        duration: 5000,
      });
    } finally {
      setSwapping(false);
    }
  }, [
    address,
    erc20,
    fromAmountWei,
    isWeb3Enabled,
    oneInchRouter,
    srcAllowance,
    srcToken.address,
    toast,
  ]);

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
              Balance: {displaySrcBalance}
            </Text>
            <NumberInput
              size="lg"
              position="relative"
              value={fromAmount}
              onChange={(_, v) => setFromAmount(v || 0)}
              onKeyDown={(e) => {
                if (e.key === '.') {
                  setFromAmount(fromAmount + 0.1);
                }
              }}
            >
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
              Balance: {displayDstBalance}
            </Text>
            <NumberInput
              size="lg"
              position="relative"
              value={toAmount}
              onChange={() => null}
            >
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
          {swapButtonText}
        </Button>
      </WhiteBox>
    </>
  );
};

export default Swap;
