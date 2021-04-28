import React, { useCallback } from 'react';
import { Box, Container, Flex, HStack, Text } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
import { FaNewspaper, FaTelegram } from 'react-icons/fa';
import { Image } from '@chakra-ui/image';

import openInNewTab from '../helpers/openInNewTab';
import constants from '../config/constants';
import Title from '../components/Title';

import coins from '../assets/images/coins-solid.svg';
import layers from '../assets/images/layers-solid.svg';
import network from '../assets/images/network-solid.svg';

export default function HomePage(): React.ReactElement {
  const handleTelegramLinkClick = useCallback(() => {
    openInNewTab(constants.telegramGroupLink);
  }, []);

  const handleWhitepaperLinkClick = useCallback(() => {
    openInNewTab('/whitepaper.pdf');
  }, []);

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
      <HStack
        spacing={8}
        display={{ base: 'block', md: 'flex' }}
        alignItems="start"
      >
        <Box w="100%">
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
        <Box w="100%">
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
        <Box w="100%">
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
      </HStack>
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
        </HStack>
      </Flex>
      <Title mt={20} mb={4} isSecondary>
        Tokenmetrics
      </Title>
      <Text>
        <b>Initial supply:</b> 1 trillion
      </Text>
    </Container>
  );
}
