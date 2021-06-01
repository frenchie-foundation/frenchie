import { Box,  Container,  Link,  SimpleGrid,  Stack,  Text,  useColorModeValue,
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
    <Container mt={20} mb={20}>

 
      <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}>
      <Container as={Stack} maxW={'6xl'} py={10}>
        <SimpleGrid
          templateColumns={{ sm: '1fr 1fr', md: '2fr 1fr 1fr 1fr 1fr' }}
          spacing={8}>
          <Stack spacing={6}>
            <Box>
              <Logo color={useColorModeValue('gray.700', 'white')} />
            </Box>
            <Text mt={10} textAlign="center">
        Made with ❤️ by{' '}
        <Link href="https://spiry.ro" target="_blank">
          Spiry Capital
        </Link>
      </Text>
            <Text fontSize={'sm'}>
              © 2021 Frenchie Network. All rights reserved 
            </Text>
            
          </Stack>
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
            <Link target="_blank" href={'https://hub.frenchie.info'}>Frenchie Info Hub</Link>
            <Link target="_blank" href={'/frenchie-whitepaper.pdf'}>Whitepaper (Lite)</Link>
            <Link target="_blank" href={constants.pancakeSwapLink}>Pancake Swap V1</Link>
            <Link target="_blank" href={constants.oneInchSwapLink}>1inch BSC Swap</Link>
            <Link target="_blank" href="/audit-report.pdf">Audit Report</Link>
            <Link target="_blank" href="https://spiry.ro/">Team</Link>
          </Stack>
          <Stack align={'flex-start'}>
          <Title mb={4}>Partners</Title>
            <Link href={'#'}>Help Center</Link>
            <Link href={'#'}>Terms of Service</Link>
            <Link href={'#'}>Legal</Link>
            <Link href={'#'}>Privacy Policy</Link>
            <Link href={'#'}>Status</Link>
          </Stack>
          <Stack align={'flex-start'}>
          <Title mb={4}>Social Media</Title>
            <Link href={'#'}>Telegram Group</Link>
            <Link href={'#'}>Discord</Link>
            <Link href={'#'}>Twitter</Link>
            <Link href={'#'}>Instagram</Link>
            <Link href={'#'}>Reddit</Link>
          </Stack>
        </SimpleGrid>
      </Container>
    </Box>
    </Container>
  );
}
