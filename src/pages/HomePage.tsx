import React, { useCallback } from 'react';
import {
  Badge,
  Box,
  Container,
  Flex,
  List,
  ListItem,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/layout';
import { Logo } from '../components/Logo';
import { Button } from '@chakra-ui/button';
import { FaTelegram } from 'react-icons/fa';
import openInNewTab from '../helpers/openInNewTab';
import constants from '../config/constants';

export default function HomePage(): React.ReactElement {
  const handleTelegramLinkClick = useCallback(() => {
    openInNewTab(constants.telegramGroupLink);
  }, []);

  return (
    <Container>
      <Box textAlign="center" fontSize="xl">
        <VStack spacing={8}>
          <Logo h="180px" pointerEvents="none" />
          <Text fontSize={48} fontWeight="bold">
            Frenchie Token
          </Text>
        </VStack>
      </Box>
      <Flex direction="row" justifyContent="center" mt={10}>
        <Stack spacing={5} direction="row">
          <Badge colorScheme="red">Meme token</Badge>
          <Badge colorScheme="green">Community driven</Badge>
          <Badge colorScheme="purple">Fun doggie</Badge>
        </Stack>
      </Flex>
      <Box mt={10}>
        <Text align="center" fontWeight="bold" fontSize={32}>
          TOKENMETRICS
        </Text>
        <Flex direction="row" justifyContent="space-between" mt={10}>
          <Box w="100%" textAlign="center">
            <Text fontWeight="bold" fontSize={24} mb={5}>
              Total Supply
            </Text>
            <Text fontWeight="bold" fontSize={18}>
              {(1_000_000_000_000).toLocaleString()}
            </Text>
          </Box>
          <Box w="100%" textAlign="center" fontWeight="bold">
            <Text fontSize={24} mb={5}>
              Supporting
            </Text>
            <List textAlign="center">
              <ListItem>20% Dev team</ListItem>
              <ListItem>25% Vitalik Buterin</ListItem>
              <ListItem>30% Marketing</ListItem>
            </List>
          </Box>
          <Box w="100%" textAlign="center" fontWeight="bold">
            <Text fontSize={24} mb={5}>
              Liquidity
            </Text>
            <List textAlign="center">
              <ListItem>25% PancakeSwap</ListItem>
            </List>
          </Box>
        </Flex>
      </Box>
      <Box textAlign="center" mt={20}>
        <Button
          colorScheme="telegram"
          leftIcon={<FaTelegram />}
          onClick={handleTelegramLinkClick}
        >
          Telegram group
        </Button>
      </Box>
    </Container>
  );
}
