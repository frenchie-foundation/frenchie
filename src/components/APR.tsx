import { HStack } from '@chakra-ui/layout';
import { ChakraProps } from '@chakra-ui/system';
import React, { useEffect, useMemo, useState } from 'react';
import constants from '../config/constants';
import { useContracts } from '../store/contracts';
import WhiteBox from './WhiteBox';
import BigNumber from 'bignumber.js';
import { BLOCKS_PER_YEAR } from '../config';
import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Text,
} from '@chakra-ui/react';
import Title from './Title';

const APR: React.FC<ChakraProps> = (props: ChakraProps) => {
  const [frenPrice, setFrenPrice] = useState(0);
  const { pancakeRouter } = useContracts();
  //API FORMULA TEST
  const frenRewardsPerYear = useMemo(() => {
    return new BigNumber(BLOCKS_PER_YEAR);
  }, []);
  const oneyearapy = useMemo(() => {
    return new BigNumber(frenRewardsPerYear).multipliedBy(frenPrice);
  }, [frenRewardsPerYear, frenPrice]);
  const apy = useMemo(() => {
    return new BigNumber(oneyearapy).multipliedBy(4);
  }, [oneyearapy]);

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
  return (
    <HStack
      spacing={{ base: 0, md: 2 }}
      display={{ base: 'block', md: 'flex' }}
      alignItems="start"
      mt={10}
      maxW="100%"
      {...props}
    >
      <WhiteBox
        w="100%"
        mb={{ base: 4, md: 0 }}
        bg="gray.900"
        boxShadow="lg"
        transition="0.2s"
        _hover={{
          boxShadow: 'xl',
        }}
      >
        <Title mb={2}>Annual Percentage Rate</Title>
        <Stat>
          <StatLabel>
            <Text>FREN + BNB (APR %)</Text>
          </StatLabel>
          <StatNumber>
            <Text fontSize="35px">{apy.toPrecision(4)}%</Text>
          </StatNumber>
          <StatHelpText>
            <Text>
              Approximation based on (12 Months APR x 4 = 3 Months APR %){' '}
            </Text>
          </StatHelpText>
        </Stat>
      </WhiteBox>
    </HStack>
  );
};

export default APR;
