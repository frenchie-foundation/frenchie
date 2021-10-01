import {
  Box,
  Container,
  Link,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import React, { useCallback } from 'react';
import { useHistory } from 'react-router';
import constants from '../config/constants';
import { Logo } from './Logo';
import Title from './Title';

export default function Footer(): React.ReactElement {
  const history = useHistory();

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
    <Box
      mt={20}
      mb={5}
      maxW="175ch"
      marginX={{ base: 4, xl: 20, '2xl': 'auto' }}
      borderRadius={8}
    >
      <Box
        bg={useColorModeValue('gray.50', 'gray.900')}
        color={useColorModeValue('gray.700', 'gray.200')}
        padding={4}
        borderRadius={8}
      >
        <Container as={Stack} maxW={'6xl'} py={10}>
          <SimpleGrid
            templateColumns={{ sm: '1fr 1fr', md: '2fr 1fr 1fr 1fr' }}
            spacing={8}
          >
            <Box display="flex" alignItems="center" flexDirection="column">
              <Logo />
              <Text mt={10} mb={4} textAlign="center">
                Made with ❤️ by{' '}
                <Link href="https://spiry.ro" target="_blank">
                  Spiry Capital
                </Link>
              </Text>
              <Text fontSize={'sm'}>
                © 2021 Frenchie Network. All rights reserved
              </Text>
            </Box>
            <Stack align={'flex-start'}>
              <Title mb={4}>Pages</Title>
              <Link onClick={goTo('/')} href="/">
                Home
              </Link>
              <Link onClick={goTo('/farming')} href="/farming">
                Farming
              </Link>
              <Link onClick={goTo('/swap')} href="/swap">
                Frenchie Swap
              </Link>
            </Stack>
            <Stack align={'flex-start'}>
              <Title mb={4}>Useful Links</Title>
              <Link target="_blank" href={'https://hub.frenchie.tech'}>
                Frenchie Info Hub
              </Link>
              <Link target="_blank" href={'/frenchie-whitepaper.pdf'}>
                Whitepaper (Lite)
              </Link>
              <Link target="_blank" href={constants.pancakeSwapLink}>
                Pancake Swap V1
              </Link>
              <Link target="_blank" href={constants.oneInchSwapLink}>
                1inch BSC Swap
              </Link>
              <Link target="_blank" href="/audit-report.pdf">
                Audit Report
              </Link>
              <Link target="_blank" href="https://spiry.ro/">
                Team
              </Link>
              <Link
                target="_blank"
                href="https://www.notion.so/spirycorp/8a29496af47c4c0eb03c3e5790052f28?v=1884d45723544435b01c57874400ebb9"
              >
                Live Roadmap
              </Link>
              <Link target="_blank" href={constants.gitbookGroupLink}>
                Documentation
              </Link>
            </Stack>
            <Stack align={'flex-start'}>
              <Title mb={4}>Social Media</Title>
              <Link target="_blank" href={'https://t.me/FrenchieNetwork'}>
                Telegram Group
              </Link>
              <Link target="_blank" href={'https://discord.gg/6PeBA7K2Aw'}>
                Discord
              </Link>
              <Link target="_blank" href={'https://twitter.com/FrenchieToken'}>
                Twitter
              </Link>
              <Link
                target="_blank"
                href={'https://www.instagram.com/frenchie.network/'}
              >
                Instagram
              </Link>
              <Link
                target="_blank"
                href={'https://www.reddit.com/r/FrenchieToken/'}
              >
                Reddit
              </Link>
            </Stack>
          </SimpleGrid>
        </Container>
      </Box>
    </Box>
  );
}
