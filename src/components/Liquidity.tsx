import { Button } from '@chakra-ui/button';
import {
  FormControl,
  FormHelperText,
  FormLabel,
} from '@chakra-ui/form-control';
import { Image } from '@chakra-ui/react';
import { Flex, HStack, Text } from '@chakra-ui/layout';
import { NumberInput, NumberInputField } from '@chakra-ui/number-input';
import { Progress } from '@chakra-ui/progress';
import { ChakraProps } from '@chakra-ui/system';
import { useToast } from '@chakra-ui/toast';
import BigNumber from 'bignumber.js';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import constants from '../config/constants';
import { useContracts } from '../store/contracts';
import { useWallet } from '../store/wallet';
import Title from './Title';
import WhiteBox from './WhiteBox';
import bnbLogo from '../assets/images/binance-coin-bnb-logo.svg';
import frenLogo from '../assets/images/logo.svg';

const Liquidity: React.FC<ChakraProps> = (props: ChakraProps) => {
  const toast = useToast();

  const { oneInch, frenToken, pancakeRouter } = useContracts();
  const { isWeb3Enabled, web3, address } = useWallet();

  const [loading, setLoading] = useState(false);
  const [frenBalance, setFrenBalance] = useState(new BigNumber(0));
  const [frenValue, setFrenValue] = useState(new BigNumber(0));
  const [bnbBalance, setBnbBalance] = useState(new BigNumber(0));
  const [bnbValue, setBnbValue] = useState(new BigNumber(0));
  const [frenLpBalance, setFrenLpBalance] = useState(new BigNumber(0));

  // ADD LIQUIDITY
  const [addingLiquidity, setAddingLiquidity] = useState(false);
  const [addUsdValue, setAddUsdValue] = useState(new BigNumber(0));
  const [addBnbValue, setAddBnbValue] = useState(new BigNumber(0));
  const [addFrenValue, setAddFrenValue] = useState(new BigNumber(0));
  const [frenAllowance, setFrenAllowance] = useState(new BigNumber(0));

  // REMOVE LIQUIDITY
  const [removingLiquidity, setRemovingLiquidity] = useState(false);
  const [removeFrenLpValue, setRemoveFrenLpValue] = useState(new BigNumber(0));
  const [removeFrenValue, setRemoveFrenValue] = useState(new BigNumber(0));
  const [removeBnbValue, setRemoveBnbValue] = useState(new BigNumber(0));

  const convertLpToTokens = useCallback(
    async (amount: BigNumber) => {
      if (!isWeb3Enabled) {
        return;
      }
      const { balance: poolBnbBalance } = await oneInch?.methods
        .virtualBalancesForRemoval('0x0000000000000000000000000000000000000000')
        .call();
      const { balance: poolFrenBalance } = await oneInch?.methods
        .virtualBalancesForRemoval(constants.tokenAddress)
        .call();
      const poolSupply = await oneInch?.methods.totalSupply().call();
      return {
        bnb: new BigNumber(poolBnbBalance)
          .dividedBy(new BigNumber(poolSupply))
          .multipliedBy(amount),
        fren: new BigNumber(poolFrenBalance)
          .dividedBy(new BigNumber(poolSupply))
          .multipliedBy(amount),
      };
    },
    [isWeb3Enabled, oneInch?.methods]
  );

  useEffect(() => {
    (async () => {
      const result = await convertLpToTokens(removeFrenLpValue);
      if (!result) {
        return;
      }
      const { bnb, fren } = result;
      setRemoveBnbValue(bnb);
      setRemoveFrenValue(fren);
    })();
  }, [convertLpToTokens, removeFrenLpValue]);

  const frenLpBalanceDisplayText = useMemo(() => {
    return frenLpBalance.multipliedBy(1e-18).toString();
  }, [frenLpBalance]);

  const removeBnbValueUsd = useMemo(() => {
    return bnbValue
      .multipliedBy(removeBnbValue)
      .multipliedBy(1e-18)
      .toNumber()
      .toLocaleString();
  }, [removeBnbValue, bnbValue]);

  const removeFrenValueUsd = useMemo(() => {
    return frenValue
      .multipliedBy(removeFrenValue)
      .multipliedBy(1e-18)
      .toNumber()
      .toLocaleString();
  }, [removeFrenValue, frenValue]);

  const handleRemoveMaxValue = useCallback(() => {
    setRemoveFrenLpValue(frenLpBalance.multipliedBy(1e-18));
  }, [frenLpBalance]);

  const addBnbValueUsd = useMemo(() => {
    return bnbValue
      .multipliedBy(addBnbValue)
      .multipliedBy(1e-18)
      .toNumber()
      .toLocaleString();
  }, [addBnbValue, bnbValue]);

  const addFrenValueUsd = useMemo(() => {
    return frenValue
      .multipliedBy(addFrenValue)
      .multipliedBy(1e-18)
      .toNumber()
      .toLocaleString();
  }, [addFrenValue, frenValue]);

  const maxUsdValue = useMemo(() => {
    const frenUsdBalance = frenValue.multipliedBy(frenBalance);
    const bnbUsdBalance = bnbValue
      .multipliedBy(bnbBalance)
      .minus(500000 * 10 ** 30);

    const lower = frenUsdBalance.isGreaterThan(bnbUsdBalance)
      ? bnbUsdBalance
      : frenUsdBalance;

    if (lower.isGreaterThan(1)) {
      return lower.multipliedBy(2).multipliedBy(1e-18);
    }

    return new BigNumber(0);
  }, [bnbBalance, bnbValue, frenBalance, frenValue]);

  const maxUsdValueDisplayText = useMemo(
    () => maxUsdValue.multipliedBy(1e-18).toNumber().toLocaleString(),
    [maxUsdValue]
  );

  useEffect(() => {
    const bnbAmount = addUsdValue
      .multipliedBy(1e18)
      .dividedBy(bnbValue)
      .dividedBy(2);
    const frenAmount = addUsdValue
      .multipliedBy(1e18)
      .dividedBy(frenValue)
      .dividedBy(2);

    setAddBnbValue(bnbAmount);
    setAddFrenValue(frenAmount);
  }, [addUsdValue, bnbValue, frenValue]);

  const addLiquidityButtonText = useMemo(() => {
    if (frenAllowance.isGreaterThan(addFrenValue)) {
      return 'Add liquidity';
    }
    return 'Approve FREN';
  }, [addFrenValue, frenAllowance]);

  const handleAddMaxValue = useCallback(() => {
    setAddUsdValue(maxUsdValue.multipliedBy(1e-18));
  }, [maxUsdValue]);

  const fetchData = useCallback(async () => {
    if (isWeb3Enabled && address) {
      setLoading(true);
      await Promise.all([
        (async () => {
          const _frenBalance = await frenToken?.methods
            .balanceOf(address)
            .call();
          setFrenBalance(new BigNumber(_frenBalance));
        })(),
        (async () => {
          const _frenLpBalance = await oneInch?.methods
            .balanceOf(address)
            .call();
          setFrenLpBalance(new BigNumber(_frenLpBalance));
        })(),
        (async () => {
          const _bnbBalance = await web3.eth.getBalance(address);
          setBnbBalance(new BigNumber(_bnbBalance));
        })(),
        (async () => {
          const _allowance = await frenToken?.methods
            .allowance(address, constants.oneInchLPAddress)
            .call();
          setFrenAllowance(new BigNumber(_allowance));
        })(),
      ]);
      setLoading(false);
    }
  }, [address, frenToken?.methods, isWeb3Enabled, oneInch?.methods, web3.eth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddLiquidity = useCallback(async () => {
    if (!isWeb3Enabled) {
      return;
    }

    try {
      setAddingLiquidity(true);

      if (!frenAllowance.isGreaterThan(addFrenValue)) {
        const approved = await frenToken?.methods
          .approve(constants.oneInchLPAddress, '9'.repeat(64))
          .send({
            from: address,
          });

        if (approved) {
          toast({
            status: 'success',
            description:
              'Amount successfully approved. Now you can provide liquidity!',
            title: 'Success',
            position: 'top',
            duration: 5000,
          });
        }

        return;
      }

      const amounts = [
        [
          addBnbValue.multipliedBy(1e18).toFixed(0),
          addFrenValue.multipliedBy(1e18).toFixed(0),
        ],
        [
          addBnbValue.multipliedBy(1e18).multipliedBy(0.95).toFixed(0),
          addFrenValue.multipliedBy(1e18).multipliedBy(0.95).toFixed(0),
        ],
      ];

      const success = await oneInch?.methods.deposit(...amounts).send({
        from: address,
        value: addBnbValue.multipliedBy(1e18).toFixed(0),
        gas: 250000,
      });

      if (success) {
        toast({
          status: 'success',
          description: 'Amount successfully deposited.',
          title: 'Success',
          position: 'top',
          duration: 5000,
        });
      }
    } catch (error: any) {
      toast({
        status: 'error',
        description: error.message,
        title: 'Error',
        position: 'top',
        duration: 5000,
      });
    } finally {
      setAddingLiquidity(false);
      fetchData();
    }
  }, [
    addBnbValue,
    addFrenValue,
    address,
    fetchData,
    frenAllowance,
    frenToken?.methods,
    isWeb3Enabled,
    oneInch?.methods,
    toast,
  ]);

  const handleRemoveLiquidity = useCallback(async () => {
    if (!isWeb3Enabled) {
      return;
    }

    try {
      setRemovingLiquidity(true);

      const success = await oneInch?.methods
        .withdraw(removeFrenLpValue.multipliedBy(1e18).toFixed(0), [
          removeBnbValue.multipliedBy(1e18).multipliedBy(0.95).toFixed(0),
          removeFrenValue.multipliedBy(1e18).multipliedBy(0.95).toFixed(0),
        ])
        .send({
          from: address,
          gas: 250000,
        });

      if (success) {
        toast({
          status: 'success',
          description: 'Amount successfully withdrawed.',
          title: 'Success',
          position: 'top',
          duration: 5000,
        });
      }
    } catch (error: any) {
      toast({
        status: 'error',
        description: error.message,
        title: 'Error',
        position: 'top',
        duration: 5000,
      });
    } finally {
      setRemovingLiquidity(false);
      fetchData();
    }
  }, [
    address,
    fetchData,
    isWeb3Enabled,
    oneInch?.methods,
    removeBnbValue,
    removeFrenLpValue,
    removeFrenValue,
    toast,
  ]);

  useEffect(() => {
    if (isWeb3Enabled) {
      (async () => {
        const pricePath = [constants.bnbAddress, constants.usdtAddress];
        const prices = await pancakeRouter?.methods
          .getAmountsOut(new BigNumber(1e18).toFixed(0), pricePath)
          .call();
        const _bnbValue = new BigNumber(prices[pricePath.length - 1]);
        setBnbValue(_bnbValue);
      })();
      (async () => {
        const pricePath = [
          constants.tokenAddress,
          constants.bnbAddress,
          constants.usdtAddress,
        ];
        const prices = await pancakeRouter?.methods
          .getAmountsOut(new BigNumber(1e18).toFixed(0), pricePath)
          .call();
        const _frenValue = new BigNumber(prices[pricePath.length - 1]);
        setFrenValue(_frenValue);
      })();
    }
  }, [isWeb3Enabled, pancakeRouter?.methods]);

  return (
    <HStack
      spacing={{ base: 0, md: 4 }}
      display={{ base: 'block', md: 'flex' }}
      alignItems="start"
      {...props}
    >
      <WhiteBox w="100%" mb={{ base: 4, md: 0 }}>
        {loading && <Progress size="xs" isIndeterminate />}
        <Title mb={2} color={constants.colors.dark}>
          Provide liquidity
        </Title>

        <FormControl
          id="bnbAmount"
          mb={2}
          background="gray.900"
          borderRadius={8}
          p={4}
        >
          <Flex justifyContent="space-between" alignItems="center" mb={2}>
            <Text d="flex" gridGap={2} alignItems="center">
              <Flex p={1} borderRadius={10} backgroundColor="gray.700">
                <Image src={bnbLogo} boxSize="20px" />
              </Flex>
              <FormLabel m={0}>BNB</FormLabel>
            </Text>
            <Text>≈ {Number(addBnbValueUsd) ? addBnbValueUsd : '0'} USD</Text>
          </Flex>
          <NumberInput
            onChange={() => null}
            value={addBnbValue.toNumber() || 0}
            min={0}
            max={0}
          >
            <NumberInputField bg={constants.colors.dark} color="white" />
          </NumberInput>
        </FormControl>

        <FormControl
          id="frenAmount"
          mb={4}
          background="gray.900"
          borderRadius={8}
          p={4}
        >
          <Flex justifyContent="space-between" alignItems="center" mb={2}>
            <Text d="flex" gridGap={2} alignItems="center">
              <Flex p={1} borderRadius={10} backgroundColor="gray.700">
                <Image src={frenLogo} boxSize="20px" />
              </Flex>
              <FormLabel m={0}>FREN</FormLabel>
            </Text>
            <Text>≈ {Number(addFrenValueUsd) ? addFrenValueUsd : '0'} USD</Text>
          </Flex>
          <NumberInput
            onChange={() => null}
            value={addFrenValue.toNumber() || 0}
            min={0}
            max={0}
          >
            <NumberInputField bg={constants.colors.dark} color="white" />
          </NumberInput>
        </FormControl>

        <FormControl id="usdAmount" mb={4}>
          <Flex justifyContent="space-between" alignItems="center">
            <FormLabel>USD value</FormLabel>
            <Button
              variant="link"
              color={constants.colors.dark}
              onClick={handleAddMaxValue}
            >
              Max: ≈ {maxUsdValueDisplayText} USD
            </Button>
          </Flex>
          <NumberInput
            onChange={(_, v) => {
              if (v <= maxUsdValue.multipliedBy(1e-18).toNumber()) {
                setAddUsdValue(new BigNumber(v));
              }
            }}
            value={addUsdValue.toNumber() || 0}
            min={0}
            max={maxUsdValue.multipliedBy(1e18).toNumber()}
          >
            <NumberInputField bg={constants.colors.dark} color="white" />
          </NumberInput>
          <FormHelperText color={constants.colors.dark}>
            Set value in USD to calculate tokens amount automatically
          </FormHelperText>
        </FormControl>

        <Button
          isLoading={addingLiquidity}
          disabled={addUsdValue.isZero()}
          colorScheme="teal"
          onClick={handleAddLiquidity}
          isFullWidth
        >
          {addLiquidityButtonText}
        </Button>
      </WhiteBox>

      <WhiteBox w="100%" mb={{ base: 4, md: 0 }}>
        {loading && <Progress size="xs" isIndeterminate />}
        <Title mb={2} color={constants.colors.dark}>
          Remove liquidity
        </Title>

        <FormControl
          id="bnbRemoveAmount"
          mb={2}
          bg="gray.900"
          borderRadius={8}
          p={4}
        >
          <Flex justifyContent="space-between" alignItems="center">
            <Text display="flex" gridGap={2} mb={2} alignItems="center">
              <Flex p={1} borderRadius={10} backgroundColor="gray.700">
                <Image src={bnbLogo} boxSize="20px" />
              </Flex>
              <FormLabel m={0}>BNB</FormLabel>
            </Text>
            <Text>≈ {removeBnbValueUsd} USD</Text>
          </Flex>
          <NumberInput
            onChange={() => null}
            value={removeBnbValue.toNumber() || 0}
          >
            <NumberInputField bg={constants.colors.dark} color="white" />
          </NumberInput>
        </FormControl>

        <FormControl
          id="frenRemoveAmount"
          mb={4}
          bg="gray.900"
          borderRadius={8}
          p={4}
        >
          <Flex justifyContent="space-between" alignItems="center">
            <Text display="flex" gridGap={2} mb={2} alignItems="center">
              <Flex p={1} borderRadius={10} backgroundColor="gray.700">
                <Image src={frenLogo} boxSize="20px" />
              </Flex>
              <FormLabel m={0}>FREN</FormLabel>
            </Text>
            <Text>≈ {removeFrenValueUsd} USD</Text>
          </Flex>
          <NumberInput
            onChange={() => null}
            value={removeFrenValue.toNumber() || 0}
          >
            <NumberInputField bg={constants.colors.dark} color="white" />
          </NumberInput>
        </FormControl>

        <FormControl id="lpTokensRemoveAmount" mb={4}>
          <Flex justifyContent="space-between" alignItems="center">
            <FormLabel>LP tokens amount</FormLabel>
            <Button
              variant="link"
              color={constants.colors.dark}
              onClick={handleRemoveMaxValue}
            >
              Max: {frenLpBalanceDisplayText}
            </Button>
          </Flex>
          <NumberInput
            onChange={(_, v) => {
              if (v <= frenLpBalance.multipliedBy(1e-18).toNumber()) {
                setRemoveFrenLpValue(new BigNumber(v));
              }
            }}
            value={removeFrenLpValue.toNumber() || 0}
            min={0}
            max={frenLpBalance.multipliedBy(1e-18).toNumber()}
          >
            <NumberInputField bg={constants.colors.dark} color="white" />
          </NumberInput>
          <FormHelperText color={constants.colors.dark}>
            Set value in FREN-LP to calculate tokens amount automatically
          </FormHelperText>
        </FormControl>

        <Button
          isLoading={removingLiquidity}
          disabled={removeFrenLpValue.isZero()}
          colorScheme="red"
          onClick={handleRemoveLiquidity}
          isFullWidth
        >
          Remove liquidity
        </Button>
      </WhiteBox>
    </HStack>
  );
};

export default Liquidity;
