/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Flex, HStack, Stack, Text } from '@chakra-ui/layout';
import constants from '../config/constants';
import { Logo } from './Logo';
import WalletInfo from './WalletInfo';

export default function Header(): React.ReactElement {
  return (
    <Flex px={{ xl: 16, md: '16px' }} pt={4} justifyContent="space-between">
      <Stack spacing={2} display="flex" direction="row" alignItems="center">
        <Logo height={16} />
        <Text
          fontSize={{ xl: 28, md: 24 }}
          display={{ base: 'none', md: 'block' }}
          color={constants.colors.light}
          fontWeight="bold"
        >
          Frenchie Network
        </Text>
      </Stack>
      <HStack spacing={4}>
        <WalletInfo />
      </HStack>
    </Flex>
  );
}
