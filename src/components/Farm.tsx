import { Button } from '@chakra-ui/button';
import {
  FormControl,
  FormHelperText,
  FormLabel,
} from '@chakra-ui/form-control';
import { Box, HStack } from '@chakra-ui/layout';
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

interface IWhiteBox extends ChakraProps {
  children?: React.ReactNode;
}

const WhiteBox: React.FC<IWhiteBox> = ({ children, ...props }: IWhiteBox) => {
  return (
    <Box
      bg="white"
      color={constants.colors.dark}
      p={15}
      borderRadius={5}
      {...props}
    >
      {children}
    </Box>
  );
};

const Farm: React.FC<ChakraProps> = (props: ChakraProps) => {
  const { isWeb3Enabled, address, web3 } = useWallet();
  const { farmContract, oneInch } = useContracts();

  const toast = useToast();

  const [amountToFarm, setAmountToFarm] = useState(0);

  const [claimingRewards, setClaimingRewards] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [farming, setFarming] = useState(false);
  const [loading, setLoading] = useState(true);

  const [withdrawSlider, setWithdrawSlider] = useState(0);
  const [farmSlider, setFarmSlider] = useState(0);
  const [farmingAmount, setFarmingAmount] = useState(0);
  const [allowance, setAllowance] = useState(0);
  const [rewards, setRewards] = useState(0);
  const [balance, setBalance] = useState(0);

  const displayBalance = useMemo(() => {
    if (web3.utils) {
      return Number(web3.utils.fromWei(String(balance))).toFixed(2);
    }
    return '0';
  }, [balance, web3.utils]);

  useEffect(() => {
    if (web3.utils) {
      const amount =
        Number(web3.utils.fromWei(String(balance))) * (farmSlider / 100);
      if (amount !== amountToFarm && amount !== Infinity) {
        setAmountToFarm(amount);
      }
    }
  }, [amountToFarm, balance, farmSlider, web3.utils]);

  const withdrawAmount = useMemo(() => {
    return Math.floor(farmingAmount * (withdrawSlider / 100));
  }, [farmingAmount, withdrawSlider]);

  const humanReadableWithdrawAmount = useMemo(() => {
    if (web3.utils) {
      return web3.utils.fromWei(String(withdrawAmount));
    }
    return '0';
  }, [web3.utils, withdrawAmount]);

  const fetchEverything = useCallback(async () => {
    try {
      setLoading(true);
      if (isWeb3Enabled && oneInch && address && farmContract) {
        const _allowance = await oneInch.methods
          .allowance(address, constants.farmAddress)
          .call();
        setAllowance(_allowance);

        const _balance = await oneInch.methods.balanceOf(address).call();
        setBalance(_balance);

        const _farmingAmount = await farmContract.methods
          .deposited(0, address)
          .call();
        setFarmingAmount(_farmingAmount);

        const _rewards = await farmContract.methods.userInfo(0, address).call();
        setRewards(_rewards.rewardDebt);
      }
    } finally {
      setLoading(false);
    }
  }, [address, farmContract, isWeb3Enabled, oneInch]);

  useEffect(() => {
    fetchEverything();
  }, [fetchEverything]);

  const weiAmountToFarm = useMemo(() => {
    if (web3.utils && !isNaN(amountToFarm)) {
      return web3.utils.toWei(String(amountToFarm));
    }
    return '0';
  }, [amountToFarm, web3.utils]);

  const farmButtonText = useMemo(() => {
    if (allowance >= Number(weiAmountToFarm)) {
      return 'Deposit';
    }
    return 'Approve FREN-LP';
  }, [allowance, weiAmountToFarm]);

  const handleFarm = useCallback(async () => {
    try {
      setFarming(true);

      // Approve
      if (!(allowance >= Number(weiAmountToFarm))) {
        if (oneInch) {
          const approved = await oneInch.methods
            .approve(constants.farmAddress, weiAmountToFarm)
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
        const success = await farmContract.methods
          .deposit(0, weiAmountToFarm)
          .send({
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
    } catch (error) {
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
    address,
    allowance,
    farmContract,
    fetchEverything,
    oneInch,
    toast,
    weiAmountToFarm,
  ]);

  const handleWithdraw = useCallback(async () => {
    try {
      setWithdrawing(true);

      if (farmContract) {
        const success = await farmContract.methods
          .withdraw(0, farmingAmount)
          .send({
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
    } catch (error) {
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
  }, [address, farmContract, farmingAmount, fetchEverything, toast]);

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
    } catch (error) {
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
    <HStack
      spacing={{ base: 0, md: 4 }}
      display={{ base: 'block', md: 'flex' }}
      alignItems="start"
      {...props}
    >
      <WhiteBox w="100%" mb={{ base: 4, md: 0 }}>
        {loading && <Progress size="xs" isIndeterminate />}
        <Title mb={2} color={constants.colors.dark}>
          Farming
        </Title>
        <FormControl id="amountToFarm" mb={2}>
          <FormLabel>Amount to farm</FormLabel>
          <NumberInput
            value={amountToFarm || 0}
            onChange={(_, v) => setAmountToFarm(v)}
            min={0}
            max={Number(balance)}
          >
            <NumberInputField bg={constants.colors.dark} color="white" />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <FormHelperText color={constants.colors.dark}>
            You have {displayBalance} FREN-LP
          </FormHelperText>
        </FormControl>
        <Box p={3}>
          <Slider
            value={farmSlider}
            onChange={setFarmSlider}
            step={25}
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
          disabled={amountToFarm === 0}
          colorScheme="teal"
          onClick={handleFarm}
        >
          {farmButtonText}
        </Button>
        <FormControl id="farmingAmount" mb={2} mt={4}>
          <FormLabel>Amount to withdraw</FormLabel>
          <NumberInput
            value={humanReadableWithdrawAmount}
            min={0}
            max={Number(farmingAmount)}
          >
            <NumberInputField bg={constants.colors.dark} color="white" />
          </NumberInput>
        </FormControl>
        <Box p={3}>
          <Slider
            value={withdrawSlider}
            onChange={setWithdrawSlider}
            step={25}
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
          disabled={withdrawAmount === 0}
          colorScheme="red"
          onClick={handleWithdraw}
        >
          Withdraw
        </Button>
      </WhiteBox>
      <WhiteBox w="100%">
        {loading && <Progress size="xs" isIndeterminate />}
        <Title color={constants.colors.dark}>Rewards</Title>
        <FormControl id="farmingAmount" mb={2} mt={2}>
          <FormLabel>FREN rewards</FormLabel>
          <NumberInput value={rewards} onChange={() => null}>
            <NumberInputField bg={constants.colors.dark} color="white" />
          </NumberInput>
        </FormControl>
        <Button
          isLoading={claimingRewards}
          disabled={Number(rewards) === 0}
          colorScheme="teal"
          onClick={handleClaimRewards}
        >
          Claim rewards
        </Button>
      </WhiteBox>
    </HStack>
  );
};

export default Farm;
