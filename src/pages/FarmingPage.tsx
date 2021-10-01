import React, { useCallback } from 'react';
import { Box, Container, Link, Text } from '@chakra-ui/layout';
import Title from '../components/Title';
import constants from '../config/constants';
import Farm from '../components/Farm';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
} from '@chakra-ui/react';
import { Flex } from '@chakra-ui/react';
import Liquidity from '../components/Liquidity';
import APR from '../components/APR';
import { FaHome } from 'react-icons/fa';
import { openLink } from '../helpers/openInNewTab';

export default function FarmingPage(): React.ReactElement {
  const handleSwapClick = useCallback((e?: any) => {
    if (e) {
      e.preventDefault();
    }
    openLink('/swap');
  }, []);

  const handleHomeClick = useCallback((e?: any) => {
    if (e) {
      e.preventDefault();
    }
    openLink('/');
  }, []);

  return (
    <Container>
      <Box mt={16} mb={4}>
        <Title lineHeight="48px" isPageTitle>
          Farm {'&'}
        </Title>
        <Title isPageTitle color={constants.colors.red}>
          Earn rewards
        </Title>
      </Box>

      <Flex gridGap={4}>
        <Button
          variant="outline"
          color={constants.colors.white}
          borderColor={constants.colors.white}
          px={7}
          py={6}
          fontSize="20px"
          leftIcon={<FaHome />}
          onClick={handleHomeClick}
          transition="0.2s"
          _hover={{
            boxShadow: 'xl',
          }}
        >
          Home
        </Button>
        <Button
          variant="outline"
          color={constants.colors.white}
          borderColor={constants.colors.white}
          px={7}
          py={6}
          fontSize="20px"
          onClick={handleSwapClick}
          transition="0.2s"
          _hover={{
            boxShadow: 'xl',
          }}
        >
          Frenchie Swap
        </Button>
      </Flex>

      <Text mt={16}>
        You can also access our{' '}
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
        and you will be able to deposit a certain amount of tokens (BNB+FREN) to
        participate in the liquidity farming activity. You will receive back an
        amount of FREN-BNB 1INCH-LP Tokens and will passively earn a certain
        quantity of FREN from the 1inch swap fees. EARN EXTRA when your deposit
        here on our Farming page your FREN-BNB 1INCH-LP Tokens - Up to 5000 FREN
        / 3 seconds.
      </Text>

      <APR w="550px" mb={4} />
      <Title mt={6} mb={4} isSecondary>
        Liquidity Control (FREN+BNB)
      </Title>
      <Liquidity mb={10} />
      <Title mt={4} mb={4} isSecondary>
        Frenchie Farming
      </Title>
      <Farm />
      <Flex mt={10}>
        <Title fontSize={'4xl'}>Instructions in 3 easy-steps</Title>
      </Flex>
      <Flex
        borderRadius={8}
        p={4}
        mt={6}
        gridGap={4}
        flexDir="column"
        bg="gray.900"
      >
        <Flex gridGap={4} flexDir={{ base: 'column', sm: 'row' }}>
          <Flex alignItems="center" gridGap={4} flex="1">
            <Box
              borderRadius="50%"
              w="40px"
              h="40px"
              p={2}
              bg="white"
              boxShadow="inner"
            >
              <Text color="black" textAlign="center" fontWeight="bold">
                1
              </Text>
            </Box>
            <Text fontWeight="bold">First Step</Text>
          </Flex>
          <Box display="flex" alignItems="center" flex="3">
            <Text>
              Create liquidity tokens on 1inch or use our liquidity features
              above
            </Text>
          </Box>
        </Flex>
        <Flex gridGap={4} flexDir={{ base: 'column', sm: 'row' }}>
          <Flex alignItems="center" gridGap={4} flex="1">
            <Box
              borderRadius="50%"
              w="40px"
              h="40px"
              p={2}
              bg="white"
              boxShadow="inner"
            >
              <Text color="black" textAlign="center" fontWeight="bold">
                2
              </Text>
            </Box>
            <Text fontWeight="bold">Second Step</Text>
          </Flex>
          <Box display="flex" alignItems="center" flex="3">
            <Text>Deposit FREN-BNB LP on Frenchie Farm</Text>
          </Box>
        </Flex>
        <Flex gridGap={4} flexDir={{ base: 'column', sm: 'row' }}>
          <Flex alignItems="center" gridGap={4} flex="1">
            <Box
              borderRadius="50%"
              w="40px"
              h="40px"
              p={2}
              bg="white"
              boxShadow="inner"
            >
              <Text color="black" textAlign="center" fontWeight="bold">
                3
              </Text>
            </Box>
            <Text fontWeight="bold">Third Step</Text>
          </Flex>
          <Box display="flex" alignItems="center" flex="3">
            <Text>
              Every 3 seconds 5000 FREN is divided between the number of farmers
              in our Frenchie Farm contract
            </Text>
          </Box>
        </Flex>
      </Flex>
      <Alert status="warning" borderRadius={4} mt={6}>
        <AlertIcon />
        <Box>
          <AlertTitle>DISCLAIMER</AlertTitle>
          <AlertDescription display="block">
            <Text fontSize="12px">
              Providing liquidity to pools comes with certain risks like the
              impermanent loss risk.
            </Text>
            <Text fontSize="12px">
              Please make sure you do your own research and due dilligence
              before proceeding.
            </Text>
            <Text fontSize="12px">
              Providing liquidity is an advanced subject and you should have
              some experience.
            </Text>
            <Text fontSize="12px">
              We are not responsible for any losses that might occur. Also note
              that nothing of what is described here constitutes financial
              advice.
            </Text>
          </AlertDescription>
        </Box>
      </Alert>
    </Container>
  );
}
