
import { HStack } from '@chakra-ui/layout';
import { ChakraProps } from '@chakra-ui/system';
import React, { useEffect, useMemo, useState } from 'react';
import constants from '../config/constants';
import { useContracts } from '../store/contracts';
import WhiteBox from './WhiteBox';
import BigNumber from 'bignumber.js';
import { BLOCKS_PER_YEAR} from '../config';
import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react';

const APR: React.FC<ChakraProps> = (props: ChakraProps) => {
    const [frenPrice, setFrenPrice] = useState(0);
    const { pancakeRouter } = useContracts();
    //API FORMULA TEST
    const frenRewardsPerYear = useMemo(() => { 
      return  new BigNumber(BLOCKS_PER_YEAR);}, []);
    const apy = useMemo(() => { 
      return  new BigNumber(frenRewardsPerYear).multipliedBy(frenPrice);
  }, [frenRewardsPerYear, frenPrice]);
  
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
        {...props}
      >
        <WhiteBox w="100%" mb={{ base: 4, md: 0 }}>
        <Stat>
        <StatLabel>FREN + BNB (APR %)</StatLabel>
        <StatNumber>{apy.toPrecision(5)} %</StatNumber>
        <StatHelpText>The number might differ depending on [FREN-BNB 1INCH LP] deposit size</StatHelpText>
        </Stat>
        </WhiteBox>
      </HStack>
    );
  };

  export default APR;
  