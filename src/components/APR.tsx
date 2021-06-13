
import { HStack } from '@chakra-ui/layout';
import { ChakraProps } from '@chakra-ui/system';
import React, { useEffect, useMemo, useState } from 'react';
import constants from '../config/constants';
import { useContracts } from '../store/contracts';
import Title from './Title';
import WhiteBox from './WhiteBox';
import BigNumber from 'bignumber.js';
import { BLOCKS_PER_YEAR} from '../config';

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
        spacing={{ base: 0, md: 4 }}
        display={{ base: 'block', md: 'flex' }}
        alignItems="start"
        {...props}
      >
        <WhiteBox w="100%" mb={{ base: 4, md: 0 }}>

          <Title mb={2} color={constants.colors.dark}>
            Farming APR {apy.toPrecision(5)} %
          </Title>
 
        </WhiteBox>
      </HStack>
    );
  };
  
  export default APR;
  