import React, { useCallback, useEffect, useMemo, useState } from 'react';

import BigNumber from 'bignumber.js';
import { Button, IconButton } from '@chakra-ui/button';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { useDisclosure } from '@chakra-ui/hooks';
import { Box, Flex, HStack, Text, VStack } from '@chakra-ui/layout';
import { Modal, ModalBody, ModalContent, ModalOverlay } from '@chakra-ui/modal';
import { NumberInput, NumberInputField } from '@chakra-ui/number-input';
import { ChakraProps } from '@chakra-ui/system';
import {
  FaChevronDown,
  FaCog,
  FaExchangeAlt,
  FaSyncAlt,
  FaTimes,
} from 'react-icons/fa';

import constants from '../config/constants';
import { useContracts } from '../store/contracts';
import { useWallet } from '../store/wallet';
import Title from './Title';
import WhiteBox from './WhiteBox';
import { Image } from '@chakra-ui/image';
import { useToast } from '@chakra-ui/toast';
import { Input } from '@chakra-ui/input';
import BN from 'bn.js';

interface IToken {
  symbol: string;
  address: string;
  pictureAddress?: string;
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
    pictureAddress: constants.usdtPicAddress,
  },
  {
    symbol: 'BUSD',
    address: constants.busdAddress,
    pictureAddress: constants.busdPicAddress,
  },
];

interface ICoinLabel {
  token: IToken;
  hideChevron?: boolean;
}

BigNumber.config({ EXPONENTIAL_AT: 99 });

const SLIPPAGE_ITEM = '@FrenchieSwap/slippage';
const DEADLINE_ITEM = '@FrenchieSwap/deadline';

const CoinLabel: React.FC<ICoinLabel> = ({
  token,
  hideChevron,
}: ICoinLabel) => {
  return (
    <HStack spacing={2}>
      <Image
        height={6}
        src={`https://tokens.1inch.exchange/${
          token.pictureAddress || token.address
        }.png`}
        alt={`${token.symbol} logo`}
      />
      <Text>{token.symbol}</Text>
      {!hideChevron && <FaChevronDown />}
    </HStack>
  );
};

const Swap: React.FC<ChakraProps> = ({ ...props }: ChakraProps) => {
  const {
    isOpen: isSettingsOpen,
    onOpen: onSettingsOpen,
    onClose: onSettingsClose,
  } = useDisclosure();
  const {
    isOpen: isTokensOpen,
    onOpen: onTokensOpen,
    onClose: onTokensClose,
  } = useDisclosure();

  const { isWeb3Enabled, address, web3 } = useWallet();
  const { pancakeRouter, erc20 } = useContracts();
  const toast = useToast();

  const [srcToken, setSrcToken] = useState(tokens[1]);
  const [dstToken, setDstToken] = useState(tokens[0]);
  const [srcBalance, setSrcBalance] = useState(new BigNumber(0));
  const [dstBalance, setDstBalance] = useState(new BigNumber(0));
  const [srcAllowance, setSrcAllowance] = useState<BigNumber>(new BigNumber(0));
  const [fromAmount, setFromAmount] = useState('0');
  const [toAmount, setToAmount] = useState<BigNumber>(new BigNumber(0));
  const [slippage, setSlippage] = useState(
    Number(localStorage.getItem(SLIPPAGE_ITEM)) || 7
  );
  const [deadline, setDeadline] = useState(
    Number(localStorage.getItem(DEADLINE_ITEM)) || 1200000
  );
  const [swapping, setSwapping] = useState(false);
  const [rateOrder, setRateOrder] = useState(['src', 'dst']);
  const [tokenSelect, setTokenSelect] = useState<'src' | 'dst'>('src');
  const [rate, setRate] = useState(new BigNumber(0));
  const [rateDst, setRateDst] = useState(new BigNumber(0));
  const [priceImpact, setPriceImpact] = useState(new BigNumber(0));

  useEffect(() => {
    localStorage.setItem(SLIPPAGE_ITEM, slippage.toString());
  }, [slippage]);

  useEffect(() => {
    localStorage.setItem(DEADLINE_ITEM, deadline.toString());
  }, [deadline]);

  const handleChangeRateOrder = useCallback(() => {
    const [x, y] = rateOrder;
    setRateOrder([y, x]);
  }, [rateOrder]);

  const priceDisplay = useMemo(() => {
    const first =
      rateOrder[0] === 'src'
        ? Number(fromAmount)
        : toAmount.multipliedBy(new BigNumber(1e-18)).toNumber();
    const second =
      rateOrder[1] === 'src'
        ? Number(fromAmount)
        : toAmount.multipliedBy(new BigNumber(1e-18)).toNumber();
    const rate = new BigNumber(first)
      .dividedBy(new BigNumber(second))
      .toFixed(11);
    return `${rate} ${
      rateOrder[0] === 'src' ? srcToken.symbol : dstToken.symbol
    } per ${rateOrder[1] === 'dst' ? dstToken.symbol : srcToken.symbol}`;
  }, [dstToken.symbol, fromAmount, rateOrder, srcToken.symbol, toAmount]);

  const disabled = useMemo(() => {
    if (Number(fromAmount) === 0) return true;
    return false;
  }, [fromAmount]);

  const path = useMemo(() => {
    if (srcToken.symbol !== 'BNB' && dstToken.symbol !== 'BNB') {
      return [srcToken.address, constants.bnbAddress, dstToken.address];
    }
    return [srcToken.address, dstToken.address];
  }, [dstToken.address, dstToken.symbol, srcToken.address, srcToken.symbol]);

  const handleTokenButton = useCallback(
    (type: 'src' | 'dst') => () => {
      onTokensOpen();
      setTokenSelect(type);
    },
    [onTokensOpen]
  );

  const handleTokenChange = useCallback(
    (token: IToken) => {
      onTokensClose();
      if (tokenSelect === 'src') {
        setSrcToken(token);
        return;
      }
      setDstToken(token);
    },
    [onTokensClose, tokenSelect]
  );

  const fromAmountWei = useMemo(() => {
    return new BigNumber(fromAmount).multipliedBy(new BigNumber(1e18));
  }, [fromAmount]);

  const displaySrcUsdtPrice = useMemo(() => {
    try {
      if (fromAmountWei.isGreaterThan(0)) {
        return `$${fromAmountWei
          .multipliedBy(rate.multipliedBy(new BigNumber(1e-18)))
          .multipliedBy(new BigNumber(1e-18))
          .toNumber()
          .toLocaleString()}`;
      }
    } catch {
      //
    }
    return `$${(0).toLocaleString()}`;
  }, [fromAmountWei, rate]);

  const displayDstUsdtPrice = useMemo(() => {
    try {
      if (toAmount.isGreaterThan(0)) {
        return `$${toAmount
          .multipliedBy(rateDst.multipliedBy(new BigNumber(1e-18)))
          .multipliedBy(new BigNumber(1e-18))
          .toNumber()
          .toLocaleString()}`;
      }
    } catch {
      //
    }
    return `$${(0).toLocaleString()}`;
  }, [toAmount, rateDst]);

  const priceImpactDisplay = useMemo(() => {
    return `${priceImpact.toFixed(2)}%`;
  }, [priceImpact]);

  const displaySrcBalance = useMemo(() => {
    return srcBalance.multipliedBy(new BigNumber(1e-18)).toFixed(4);
  }, [srcBalance]);

  const displayDstBalance = useMemo(() => {
    return dstBalance.multipliedBy(new BigNumber(1e-18)).toFixed(4);
  }, [dstBalance]);

  const isApproved = useMemo(() => {
    return !(
      fromAmountWei.isGreaterThan(srcAllowance) || srcAllowance.isEqualTo(0)
    );
  }, [fromAmountWei, srcAllowance]);

  const swapButtonText = useMemo(() => {
    if (!isApproved) {
      return `Approve ${srcToken.symbol}`;
    }
    return 'Swap';
  }, [isApproved, srcToken.symbol]);

  const updateRates = useCallback(async () => {
    if (!pancakeRouter || !fromAmountWei.isGreaterThan(0)) {
      return;
    }
    const amounts = await pancakeRouter?.methods
      .getAmountsOut(fromAmountWei.toFixed(0), path)
      .call();
    const _toAmount = new BigNumber(amounts[path.length - 1]);
    setToAmount(_toAmount);

    const pricePath =
      srcToken.symbol === 'BNB'
        ? [srcToken.address, constants.usdtAddress]
        : [srcToken.address, constants.bnbAddress, constants.usdtAddress];

    const prices = await pancakeRouter?.methods
      .getAmountsOut(new BigNumber(1e18).toFixed(0), pricePath)
      .call();

    const _srcRate = new BigNumber(prices[pricePath.length - 1]);

    setRate(_srcRate);

    const priceDstPath =
      dstToken.symbol === 'BNB'
        ? [dstToken.address, constants.usdtAddress]
        : [dstToken.address, constants.bnbAddress, constants.usdtAddress];

    const pricesDst = await pancakeRouter?.methods
      .getAmountsOut(new BigNumber(1e18).toFixed(0), priceDstPath)
      .call();

    const _dstRate = new BigNumber(pricesDst[priceDstPath.length - 1]);

    setRateDst(_dstRate);

    const exactQuote = _srcRate.multipliedBy(fromAmountWei);
    const outputAmount = _dstRate.multipliedBy(_toAmount);

    const impact = exactQuote
      .minus(outputAmount)
      .div(exactQuote)
      .multipliedBy(100);
    setPriceImpact(impact);
  }, [
    dstToken.address,
    dstToken.symbol,
    fromAmountWei,
    pancakeRouter,
    path,
    srcToken.address,
    srcToken.symbol,
  ]);

  useEffect(() => {
    updateRates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromAmount, dstToken.address, srcToken.address]);

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
        ?.methods.allowance(address, constants.pancakeRouterAddress)
        .call();
      setSrcAllowance(new BigNumber(allowance));
    })();
  }, [address, erc20, isWeb3Enabled, srcToken]);

  const handleTokensSwitch = useCallback(() => {
    const [x, y, f, t] = [srcToken, dstToken, fromAmount, toAmount];
    setSrcToken(y);
    setDstToken(x);
    setFromAmount(t.multipliedBy(new BigNumber(1e-18)).toString());
    setToAmount(new BigNumber(Number(f) * 10 ** 18));
  }, [dstToken, fromAmount, srcToken, toAmount]);

  const minAmount = useMemo(() => {
    return toAmount
      .minus(toAmount.multipliedBy(new BigNumber(slippage / 100)))
      .toFixed(0);
  }, [slippage, toAmount]);

  const minAmountDisplay = useMemo(() => {
    return new BigNumber(minAmount).multipliedBy(1e-18).toFixed(4);
  }, [minAmount]);

  const handleSwap = useCallback(async () => {
    if (!isWeb3Enabled || !pancakeRouter) {
      return;
    }

    await updateRates();

    setSwapping(true);

    try {
      if (!isApproved) {
        const approved = await erc20(srcToken.address)
          ?.methods.approve(constants.pancakeRouterAddress, '9'.repeat(64))
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

      const gasPrice = 250000;

      if (srcToken.symbol === 'BNB') {
        await pancakeRouter.methods
          .swapETHForExactTokens(
            new BN(toAmount.toString()),
            path,
            address,
            Date.now() + deadline
          )
          .send({
            from: address,
            value: new BN(fromAmountWei.toString()),
            gas: gasPrice,
          });
      } else if (dstToken.symbol === 'BNB') {
        await pancakeRouter.methods
          .swapExactTokensForETH(
            fromAmountWei.toString(),
            new BN(minAmount),
            path,
            address,
            Date.now() + deadline
          )
          .send({
            from: address,
            gas: gasPrice,
          });
      } else {
        await pancakeRouter.methods
          .swapExactTokensForTokens(
            fromAmountWei.toString(),
            new BN(minAmount),
            path,
            address,
            Date.now() + deadline
          )
          .send({
            from: address,
            gas: gasPrice,
          });
      }

      toast({
        status: 'success',
        description: `Successfully swapped ${srcToken.symbol} for ${dstToken.symbol}!`,
        title: 'Success',
        position: 'top',
        duration: 5000,
      });
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
    deadline,
    dstToken.symbol,
    erc20,
    fromAmountWei,
    isApproved,
    isWeb3Enabled,
    minAmount,
    pancakeRouter,
    path,
    srcToken.address,
    srcToken.symbol,
    toAmount,
    toast,
    updateRates,
  ]);

  const handleSetMaxSrc = useCallback(() => {
    let amount = srcBalance;
    if (srcToken.symbol === 'BNB') {
      amount = srcBalance.minus(0.0075e18);
      if (!amount.isGreaterThan(0)) {
        amount = new BigNumber(0);
      }
    }
    setFromAmount(amount.multipliedBy(new BigNumber(1e-18)).toFixed(4, 1));
  }, [srcBalance, srcToken.symbol]);

  return (
    <>
      <Modal isCentered isOpen={isSettingsOpen} onClose={onSettingsClose}>
        <ModalOverlay />
        <ModalContent>
          <Flex p={4} justifyContent="space-between" alignItems="center">
            <Title>Settings</Title>
            <IconButton
              aria-label="close"
              icon={<FaTimes />}
              onClick={onSettingsClose}
            />
          </Flex>
          <ModalBody px={4}>
            <FormControl id="slippage" mb={2}>
              <FormLabel fontWeight="bold">Slippage tolerance (%)</FormLabel>
              <NumberInput
                size="lg"
                position="relative"
                defaultValue={slippage}
                onChange={(_, v) => setSlippage(Number(v) || 0)}
              >
                <NumberInputField
                  placeholder="0.8%"
                  bg={constants.colors.dark}
                  color="white"
                />
              </NumberInput>
            </FormControl>
            <FormControl id="deadline" mb={2}>
              <FormLabel fontWeight="bold">
                Transaction deadline (minutes)
              </FormLabel>
              <NumberInput
                size="lg"
                position="relative"
                defaultValue={deadline / 1000 / 60}
                onChange={(_, v) =>
                  setDeadline(Number(v * 1000 * 60) || 1200000)
                }
              >
                <NumberInputField
                  placeholder="20 minutes"
                  bg={constants.colors.dark}
                  color="white"
                />
              </NumberInput>
            </FormControl>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal isCentered isOpen={isTokensOpen} onClose={onTokensClose}>
        <ModalOverlay />
        <ModalContent>
          <Flex p={4} justifyContent="space-between" alignItems="center">
            <Title>Select a token</Title>
            <IconButton
              aria-label="close"
              icon={<FaTimes />}
              onClick={onTokensClose}
            />
          </Flex>
          <ModalBody p={4}>
            {tokens.map((token) => (
              <Button
                justifyContent="flex-start"
                isFullWidth
                key={token.symbol}
                mt={2}
                disabled={
                  token.symbol === srcToken.symbol ||
                  token.symbol === dstToken.symbol
                }
                onClick={() => handleTokenChange(token)}
              >
                <CoinLabel token={token} hideChevron />
              </Button>
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>
      <VStack maxWidth="100%" spacing={4}>
        <WhiteBox maxWidth="100%" width="600px" {...props}>
          <Flex alignItems="center" justifyContent="space-between">
            <Title mb={0} color={constants.colors.dark}>
              Swap
            </Title>
            <Box>
              <IconButton
                aria-label="refresh"
                icon={<FaSyncAlt />}
                onClick={updateRates}
              />
              <IconButton
                aria-label="settings"
                icon={<FaCog />}
                onClick={onSettingsOpen}
              />
            </Box>
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
              <FormLabel fontWeight="bold">From</FormLabel>
              <Text
                cursor="pointer"
                onClick={handleSetMaxSrc}
                position="absolute"
                right={0}
                top={0}
                color="black"
              >
                Balance: {displaySrcBalance}
              </Text>
              <Box position="relative">
                <Input
                  background={constants.colors.dark}
                  color={constants.colors.light}
                  placeholder="0.0"
                  type="text"
                  size="lg"
                  value={fromAmount}
                  onChange={(e) => {
                    if (!/^\d*\.?\d*$/.test(e.target.value)) {
                      return;
                    }
                    if (e.target.value.replace(/[^.]/g, '').length > 1) {
                      return;
                    }
                    setFromAmount(e.target.value);
                  }}
                  step={0.0001}
                  min={0}
                />
                <Box position="absolute" right="1" top="1" zIndex={999}>
                  <Button
                    mr={1}
                    variant="ghost"
                    colorScheme="gray"
                    color="white"
                    onClick={handleSetMaxSrc}
                  >
                    MAX
                  </Button>
                  <Button
                    colorScheme="gray"
                    color="white"
                    onClick={handleTokenButton('src')}
                  >
                    <CoinLabel token={srcToken} />
                  </Button>
                </Box>
              </Box>
            </FormControl>
            ≈ {displaySrcUsdtPrice}
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
              <FormLabel fontWeight="bold">To</FormLabel>
              <Text position="absolute" right={0} top={0} color="black">
                Balance: {displayDstBalance}
              </Text>
              <NumberInput
                size="lg"
                position="relative"
                value={toAmount
                  .multipliedBy(new BigNumber(1e-18))
                  .toNumber()
                  .toFixed(4)}
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
                  onClick={handleTokenButton('dst')}
                >
                  <CoinLabel token={dstToken} />
                </Button>
              </NumberInput>
            </FormControl>
            ≈ {displayDstUsdtPrice}
          </Box>
          {!disabled && (
            <>
              <Flex mt={4} justifyContent="space-between" alignItems="center">
                <Text fontWeight="bold" color={constants.colors.dark}>
                  Price:
                </Text>
                <Text
                  display="flex"
                  alignItems="center"
                  fontWeight="bold"
                  color={constants.colors.dark}
                >
                  {priceDisplay}
                  <IconButton
                    aria-label="Invert rate"
                    size="sm"
                    ml={2}
                    icon={<FaExchangeAlt color={constants.colors.dark} />}
                    onClick={handleChangeRateOrder}
                  />
                </Text>
              </Flex>
              <Flex justifyContent="space-between" alignItems="center">
                <Text fontWeight="bold" color={constants.colors.dark}>
                  Slippage tolerance:
                </Text>
                <Text
                  display="flex"
                  alignItems="center"
                  fontWeight="bold"
                  color={constants.colors.dark}
                >
                  {slippage}%
                </Text>
              </Flex>
            </>
          )}
          <Button
            onClick={handleSwap}
            isFullWidth
            size="lg"
            mt={4}
            colorScheme="teal"
            isLoading={swapping}
            isDisabled={disabled}
          >
            {swapButtonText}
          </Button>
        </WhiteBox>
        {!disabled && (
          <WhiteBox maxWidth="100%" width="600px">
            <Flex justifyContent="space-between" alignItems="center">
              <Text fontWeight="bold" color={constants.colors.dark}>
                Minimum received:
              </Text>
              <Text
                display="flex"
                alignItems="center"
                fontWeight="bold"
                color={constants.colors.dark}
              >
                {minAmountDisplay} {dstToken.symbol}
              </Text>
            </Flex>
            <Flex justifyContent="space-between" alignItems="center">
              <Text fontWeight="bold" color={constants.colors.dark}>
                Price impact:
              </Text>
              <Text
                display="flex"
                alignItems="center"
                fontWeight="bold"
                color={constants.colors.dark}
              >
                {priceImpactDisplay}
              </Text>
            </Flex>
          </WhiteBox>
        )}
      </VStack>
    </>
  );
};

export default Swap;