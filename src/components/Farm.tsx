import { Button } from '@chakra-ui/button';
import {
  FormControl,
  FormHelperText,
  FormLabel,
} from '@chakra-ui/form-control';
import { Box, HStack, Text } from '@chakra-ui/layout';
import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/number-input';
import { ChakraProps } from '@chakra-ui/system';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import constants from '../config/constants';
import { useContracts } from '../store/contracts';
import { useWallet } from '../store/wallet';
import Title from './Title';
import { useToast } from '@chakra-ui/toast';
import { Progress } from '@chakra-ui/progress';
import {
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from '@chakra-ui/slider';
import { toEther, toWei } from '../helpers/units';
import axios from 'axios';
import WhiteBox from './WhiteBox';
import BigNumber from 'bignumber.js';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from '@chakra-ui/alert';
import { Stack } from '@chakra-ui/react';

const Farm: React.FC<ChakraProps> = (props: ChakraProps) => {
  const { isWeb3Enabled, address, web3 } = useWallet();
  const { farmContract, oneInch, pancakeRouter } = useContracts();
  const toast = useToast();
  const [frenPrice, setFrenPrice] = useState(0);

  const [claimingRewards, setClaimingRewards] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [farming, setFarming] = useState(false);
  const [loading, setLoading] = useState(true);

  const [withdrawSlider, setWithdrawSlider] = useState(0);
  const [farmSlider, setFarmSlider] = useState(0);
  const [allowance, setAllowance] = useState(0);

  const [withdrawAmount, setWithdrawAmount] = useState('0');
  const [amountToFarm, setAmountToFarm] = useState('0');
  const [farmingAmount, setFarmingAmount] = useState('0');
  const [rewards, setRewards] = useState('0');
  const [balance, setBalance] = useState('0');
  const usdRewardsPrice = useMemo(() => {
    return (Number(rewards) * frenPrice).toLocaleString();
  }, [rewards, frenPrice]);

  const displayBalance = useMemo(() => {
    return toEther(balance);
  }, [balance]);

  const displayFarming = useMemo(() => {
    return toEther(farmingAmount);
  }, [farmingAmount]);

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

        setFrenPrice(new BigNumber(usdtPrice).multipliedBy(1e-18).toNumber());
      }
    })();
  }, [pancakeRouter]);

  useEffect(() => {
    if (web3.utils) {
      const { toBN } = web3.utils;
      const _farmSlider = toBN(farmSlider);
      const amount = toBN(balance).mul(_farmSlider).div(toBN(100));
      setAmountToFarm(amount.toString());
    }
  }, [balance, farmSlider, web3.utils]);

  useEffect(() => {
    if (web3.utils) {
      const { toBN } = web3.utils;
      const _withdrawSlider = toBN(withdrawSlider);
      const amount = toBN(farmingAmount).mul(_withdrawSlider).div(toBN(100));
      setWithdrawAmount(amount.toString());
    }
  }, [withdrawSlider, web3.utils, farmingAmount]);

  const fetchEverything = useCallback(async () => {
    setFarmSlider(0);
    setWithdrawSlider(0);

    try {
      setLoading(true);
      if (web3.utils && isWeb3Enabled && oneInch && address && farmContract) {
        const [_allowance, _balance, _farmingAmount, { data }] =
          await Promise.all([
            oneInch.methods.allowance(address, constants.farmAddress).call(),
            oneInch.methods.balanceOf(address).call(),
            farmContract.methods.deposited(0, address).call(),
            axios.get(
              'https://api.1inch.exchange/v3.0/56/quote?toTokenAddress=0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d&fromTokenAddress=0x13958e1eb63dfb8540eaf6ed7dcbbc1a60fd52af&amount=10000000000000000'
            ),
          ]);

        setAllowance(_allowance);
        setBalance(_balance);
        setFarmingAmount(_farmingAmount);
        setFrenPrice(data.toTokenAmount / data.fromTokenAmount);
        setRewards('0');
      }
    } finally {
      setLoading(false);
    }
  }, [address, farmContract, isWeb3Enabled, oneInch, web3.utils]);

  useEffect(() => {
    fetchEverything();
  }, [fetchEverything]);

  useEffect(() => {
    if (web3.utils && isWeb3Enabled && address && farmContract) {
      let timeout: NodeJS.Timeout;

      const updateRewards = async () => {
        const _rewards = await farmContract.methods.pending(0, address).call();
        setRewards(web3.utils.fromWei(_rewards));
        timeout = setTimeout(updateRewards, 10000);
      };

      updateRewards();

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [address, farmContract, isWeb3Enabled, web3.utils]);

  const farmButtonText = useMemo(() => {
    if (allowance >= Number(amountToFarm)) {
      return 'Deposit';
    }
    return 'Approve FREN-LP';
  }, [allowance, amountToFarm]);

  const handleFarm = useCallback(async () => {
    try {
      setFarming(true);

      const amount = amountToFarm > balance ? balance : amountToFarm;

      // Approve
      if (!(allowance >= Number(amount))) {
        if (oneInch) {
          const approved = await oneInch.methods
            .approve(constants.farmAddress, '9'.repeat(64))
            .send({
              from: address,
            });

          if (approved) {
            toast({
              status: 'success',
              description: 'Amount successfully approved. Now you can farm!',
              title: 'Success',
              position: 'top',
              duration: 5000,
            });
          }
        }

        return;
      }

      // Farm
      if (farmContract) {
        const success = await farmContract.methods.deposit(0, amount).send({
          from: address,
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
      fetchEverything();
      setFarming(false);
    }
  }, [
    allowance,
    amountToFarm,
    farmContract,
    oneInch,
    address,
    toast,
    balance,
    fetchEverything,
  ]);

  const handleWithdraw = useCallback(async () => {
    try {
      setWithdrawing(true);

      const amount =
        withdrawAmount > farmingAmount ? farmingAmount : withdrawAmount;

      if (farmContract) {
        const success = await farmContract.methods.emergencyWithdraw(0).send({
          from: address,
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
      fetchEverything();
      setWithdrawing(false);
    }
  }, [
    address,
    farmContract,
    farmingAmount,
    fetchEverything,
    toast,
    withdrawAmount,
  ]);

  const handleClaimRewards = useCallback(async () => {
    try {
      setClaimingRewards(true);

      if (farmContract) {
        const success = await farmContract.methods.withdraw(0, 0).send({
          from: address,
        });

        if (success) {
          toast({
            status: 'success',
            description: 'Rewards successfully claimed.',
            title: 'Success',
            position: 'top',
            duration: 5000,
          });
        }
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
      fetchEverything();
      setClaimingRewards(false);
    }
  }, [address, farmContract, fetchEverything, toast]);

  return (
    <>
      <Alert status="error" mb={5}>
        <Stack direction={{ base: 'column', lg: 'row' }}>
          <Stack direction="row">
            <AlertIcon />
            <AlertTitle mr={2}>Farm period has ended!</AlertTitle>
          </Stack>
          <AlertDescription>
            You can now only withdraw your LP. Stay tuned for farm updates!
          </AlertDescription>
        </Stack>
      </Alert>
      <HStack
        spacing={{ base: 0, md: 4 }}
        display={{ base: 'block', md: 'flex' }}
        alignItems="start"
        {...props}
      >
        <WhiteBox w="100%" mb={{ base: 4, md: 0 }}>
          {loading && <Progress size="xs" isIndeterminate />}
          <FormControl id="amountToFarm" mb={2}>
            <Title color={constants.colors.dark} mb={2}>
              Amount to farm
            </Title>
            <Box bg="gray.900" p={4} borderRadius={8}>
              <NumberInput
                value={toEther(amountToFarm)}
                onChange={(_, v) => setAmountToFarm(toWei(v))}
                min={0}
                max={Number(balance)}
              >
                <NumberInputField bg={constants.colors.dark} color="white" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormHelperText mt={4}>
                <Text>You have {displayBalance} FREN-LP</Text>
              </FormHelperText>
            </Box>
          </FormControl>
          <Box p={3}>
            <Slider
              value={farmSlider}
              onChange={setFarmSlider}
              step={10}
              colorScheme="teal"
            >
              <SliderTrack bg="teal.100">
                <SliderFilledTrack bg="cyan" />
              </SliderTrack>
              <SliderThumb boxSize={6} color="teal" bg="teal" />
            </Slider>
          </Box>
          <Button
            isLoading={farming}
            disabled={!amountToFarm || amountToFarm === '0' || true}
            colorScheme="teal"
            onClick={handleFarm}
            isFullWidth
          >
            {farmButtonText}
          </Button>
        </WhiteBox>
        <WhiteBox w="100%">
          <FormControl id="farmingAmount" mb={2}>
            <Title color={constants.colors.dark} mb={2}>
              Amount to withdraw
            </Title>
            <Box borderRadius={8} bg="gray.900" p={4}>
              <NumberInput
                value={toEther(withdrawAmount)}
                onChange={(_, v) => setWithdrawAmount(toWei(v))}
                min={0}
                max={toEther(withdrawAmount)}
              >
                <NumberInputField bg={constants.colors.dark} color="white" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormHelperText mt={4}>
                <Text>You are using {displayFarming} FREN-LP to farm FREN</Text>
              </FormHelperText>
            </Box>
          </FormControl>
          <Box p={3}>
            <Slider
              value={withdrawSlider}
              onChange={setWithdrawSlider}
              step={10}
              colorScheme="red"
            >
              <SliderTrack bg="red.100">
                <SliderFilledTrack bg="tomato" />
              </SliderTrack>
              <SliderThumb boxSize={6} color="red" bg="red" />
            </Slider>
          </Box>
          <Button
            isLoading={withdrawing}
            disabled={!withdrawAmount || withdrawAmount === '0'}
            colorScheme="red"
            onClick={handleWithdraw}
            isFullWidth
          >
            Withdraw
          </Button>
        </WhiteBox>
      </HStack>
      <HStack>
        <WhiteBox w="100%" mt={4}>
          {loading && <Progress size="xs" isIndeterminate />}
          <Title color={constants.colors.dark}>Rewards</Title>
          <FormControl
            id="rewardsAmount"
            mb={2}
            mt={2}
            bg="gray.900"
            p={4}
            borderRadius={8}
          >
            <FormLabel>
              <Text>FREN rewards</Text>
            </FormLabel>
            <NumberInput value={rewards} onChange={() => null}>
              <NumberInputField bg={constants.colors.dark} color="white" />
            </NumberInput>
            <FormHelperText mt={4}>
              <Text>≈ {usdRewardsPrice} USD</Text>
            </FormHelperText>
          </FormControl>
          <Button
            isLoading={claimingRewards}
            disabled={Number(rewards) === 0}
            colorScheme="teal"
            onClick={handleClaimRewards}
            isFullWidth
          >
            Claim rewards
          </Button>
        </WhiteBox>
      </HStack>
    </>
  );
};

export default Farm;
