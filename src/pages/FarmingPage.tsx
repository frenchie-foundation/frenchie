import React, { useCallback } from 'react';
import {
  Box,
  Container,
  Link,
  Text,
  Flex,
  HStack,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/layout';
import Title from '../components/Title';
import constants from '../config/constants';
import Farm from '../components/Farm';
import { Button } from '@chakra-ui/button';
import { FaTint, FaCheckCircle } from 'react-icons/fa';

import openInNewTab from '../helpers/openInNewTab';

export default function FarmingPage(): React.ReactElement {
  const handleLiquidityLinkClick = useCallback(() => {
    openInNewTab(constants.addLiquidityLink);
  }, []);

  return (
    <Container>
      <Box mt={16} mb={10}>
        <Title lineHeight="48px" isPageTitle>
          Farm {'&'}
        </Title>
        <Title isPageTitle color={constants.colors.red}>
          Earn rewards
        </Title>
      </Box>
      <Title mt={4} mb={4} isSecondary>
        Info
      </Title>
      <Text>
        If you are already a liquidity provider, you can stake your LP tokens
        and earn rewards every day! Also, you can easilly become a liquidity
        provider. It’s easy, you can access our{' '}
        <Link
          fontWeight="bold"
          color={constants.colors.red}
          href={
            'https://app.1inch.io/#/56/dao/pools?action=stake&token0=0x0000000000000000000000000000000000000000&token1=0x13958e1eb63dfb8540eaf6ed7dcbbc1a60fd52af'
          }
          target="_blank"
        >
          1inch liquidity pool
        </Link>{' '}
        and will be able to deposit a certain amount of tokens (BNB+FREN) to
        collaborate with our liquidity. You will receive back an amount of LP
        tokens and will passively earn a certain quantity of FREN from the 1inch
        swap fees. Still needing help?{' '}
        <Link
          fontWeight="bold"
          color={constants.colors.red}
          href="https://i.imgur.com/9viATDk.gif"
          target="_blank"
        >
          Watch this tutorial
        </Link>
        <HStack mt={20}>
          <List spacing={3}>
            <ListItem>
              <ListIcon as={FaCheckCircle} color="green.500" />
              Create Liquidity Tokens on 1inch
            </ListItem>
            <ListItem>
              <ListIcon as={FaCheckCircle} color="green.500" />
              Deposit 1INCH FREN-BNB LP on Frenchie Farm
            </ListItem>
            <ListItem>
              <ListIcon as={FaCheckCircle} color="green.500" />
              Every 3 seconds 5000 FREN is divided between the number of farmers
              in our Frenchie Farm contract
            </ListItem>
          </List>
        </HStack>
        <Flex justifyContent="center">
          <HStack mt={10}>
            <Button
              colorScheme="purple"
              leftIcon={<FaTint />}
              onClick={handleLiquidityLinkClick}
            >
              Create Liquidity Tokens on 1inch
            </Button>
          </HStack>
        </Flex>
      </Text>
      <Farm mt={10} />
    </Container>
  );
}
