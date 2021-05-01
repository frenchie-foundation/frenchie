import React, { useCallback } from 'react';
import { Box, Container, Flex, HStack, Link, Text } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
import { FaNewspaper, FaTelegram, FaExchangeAlt, FaBug } from 'react-icons/fa';
import { Image } from '@chakra-ui/image';

import openInNewTab from '../helpers/openInNewTab';
import constants from '../config/constants';
import Title from '../components/Title';

import coins from '../assets/images/coins-solid.svg';
import layers from '../assets/images/layers-solid.svg';
import network from '../assets/images/network-solid.svg';
import { useHistory } from 'react-router';

export default function HomePage(): React.ReactElement {
  const history = useHistory();

  const handleTelegramLinkClick = useCallback(() => {
    openInNewTab(constants.telegramGroupLink);
  }, []);

  const handle1inchLinkClick = useCallback(() => {
    openInNewTab(constants.oneInchSwapLink);
  }, []);

  const handleWhitepaperLinkClick = useCallback((e?: any) => {
    if (e) {
      e.preventDefault();
    }
    openInNewTab('/whitepaper.pdf');
  }, []);

  const handleAuditLinkClick = useCallback((e?: any) => {
    if (e) {
      e.preventDefault();
    }
    openInNewTab('/audit-report.pdf');
  }, []);

  const goTo = useCallback(
    (path: string) => (e?: any) => {
      if (e) {
        e.preventDefault();
      }
      history.push(path);
    },
    [history]
  );

  return (
    <Container>
      <Box mt={16} mb={16}>
        <Title lineHeight="48px" isPageTitle>
          More than a meme
        </Title>
        <Title isPageTitle color={constants.colors.red}>
          An ecosystem
        </Title>
      </Box>
      <Box display={{ base: 'block', md: 'flex' }} alignItems="start">
        <Box p={4} w="100%">
          <Flex justifyContent="center" mb={4}>
            <Image src={coins} />
          </Flex>
          <Title mb={4} textAlign="center">
            FREN token
          </Title>
          <Text>
            <Text display="inline" color={constants.colors.red}>
              FREN{' '}
            </Text>
            is a decentralized token running in the BSC network. Built using
            BEP20 and Solidity, audited and secured by professionals.
          </Text>
        </Box>
        <Box p={4} w="100%" mt={{ base: 10, md: 0 }}>
          <Flex justifyContent="center" mb={4}>
            <Image src={layers} />
          </Flex>
          <Title mb={4} textAlign="center">
            Farming rewards
          </Title>
          <Text>
            We have a farming mechanism
            <Text display="inline" color={constants.colors.red}>
              {' '}
              to reward users{' '}
            </Text>
            that provide liquidity, improving our ecosystem and helping the
            community.
          </Text>
        </Box>
        <Box p={4} w="100%" mt={{ base: 10, md: 0 }}>
          <Flex justifyContent="center" mb={4}>
            <Image src={network} />
          </Flex>
          <Title mb={4} textAlign="center">
            Blockchain innovations
          </Title>
          <Text>
            Frenchie
            <Text display="inline" color={constants.colors.red}>
              {' '}
              won’t be just a meme token
            </Text>
            . We are working on mindblowing features to the community.
          </Text>
        </Box>
      </Box>
      <Flex justifyContent="center">
        <HStack mt={20}>
          <Button
            colorScheme="telegram"
            leftIcon={<FaTelegram />}
            onClick={handleTelegramLinkClick}
          >
            Telegram group
          </Button>
          <Button
            colorScheme="orange"
            leftIcon={<FaNewspaper />}
            onClick={handleWhitepaperLinkClick}
          >
            Our whitepaper
          </Button>
          <Button
            colorScheme="red"
            leftIcon={<FaBug />}
            onClick={handleAuditLinkClick}
          >
            Audit report
          </Button>
          <Button
            colorScheme="green"
            leftIcon={<FaExchangeAlt />}
            onClick={handle1inchLinkClick}
          >
            Buy on 1Inch
          </Button>
        </HStack>
      </Flex>

      <Title mt={20} mb={4} isSecondary>
        Tokenmetrics
      </Title>
      <Text>
        <b>Initial supply:</b> 1 trillion
      </Text>
      <Text>
        <b>Current supply:</b> 775 billions 
      </Text>
      <Text>
        <b>Total burned:</b> 225 billions (22.5%)
      </Text>
      <Text>
        <b>Tokens to burn:</b> 50 billions (6.45%)
      </Text>
      <Text>
        <b>Locked liquidity:</b> 250 billions (32.25%)
      </Text>

      <Title mt={6} mb={4} isSecondary>
        Contract addresses
      </Title>
      <Text>
        <b>FREN Token (BEP20):</b>{' '}
        <Link href={constants.bscScanLink} target="_blank">
          {constants.tokenAddress}
        </Link>
      </Text>
      <Text>
        <b>Farm contract:</b>{' '}
        <Link href={constants.bscScanLinkFarm} target="_blank">
          {constants.farmAddress}
        </Link>
      </Text>

      <Title mt={6} mb={4} isSecondary>
        The token
      </Title>
      <Text>
        FREN is a simple BEP-20 token, secure and audited by professionals.
        Doing it simple, it’s also automatically secure. That’s what we had in
        mind when we deployed it.
      </Text>
      <Text>
        In order to deliver more advanced features, we deploy other separate
        contracts to deliver farming, governance, etc. This give us more
        decentralization, security and confidence about our ecosystem.
      </Text>
      <Text>
        By the way, every contract is 100% open source and public. To find the
        source code,{' '}
        <Link
          href="https://github.com/FrenchieNetwork/contract"
          target="_blank"
          color={constants.colors.red}
          fontWeight="bold"
        >
          click here
        </Link>
        .
      </Text>

      <Title mt={6} mb={4} isSecondary>
        Rewards
      </Title>
      <Text>
        In order to reward our holders, we have a rewarding system to liquidity
        providers. If you are already a liquidity provider, you can stake your
        LP tokens in our{' '}
        <Link
          fontWeight="bold"
          color={constants.colors.red}
          href="/farming"
          onClick={goTo('/farming')}
        >
          farming page
        </Link>{' '}
        and earn rewards every day! Also, you can easilly become a liquidity
        provider. It’s easy, you can access our{' '}
        <Link
          fontWeight="bold"
          color={constants.colors.red}
          href="https://app.1inch.io/#/56/dao/pools/0xe01245e737fcc14ba053ecfe6d10eda070b5a8f9/governance"
          target="_blank"
        >
          1inch liquidity pool
        </Link>{' '}
        and will be able to deposit a certain amount of tokens (BNB+FREN) to
        collaborate with our liquidity. You will receive back an amount of LP
        tokens and will passively earn a certain quantity of FREN from the 1inch
        swap fees.
      </Text>

      <Title mt={6} mb={4} isSecondary>
        Whitepaper
      </Title>
      <Text>
        If you want to know more about the development and purposes of the
        Frenchie Network, you can{' '}
        <Link
          fontWeight="bold"
          color={constants.colors.red}
          href="/whitepaper.pdf"
          target="_blank"
          onClick={handleWhitepaperLinkClick}
        >
          access our whitepaper
        </Link>
        .
      </Text>
    </Container>
  );
}
