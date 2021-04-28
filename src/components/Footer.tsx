import {
  Box,
  Container,
  HStack,
  Link,
  List,
  ListItem,
  Stack,
  Text,
} from '@chakra-ui/layout';
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
      <Stack
        spacing={2}
        display="flex"
        direction="row"
        alignItems="center"
        mb={5}
      >
        <Logo height={9} />
        <Text fontSize={24} color={constants.colors.light} fontWeight="bold">
          Frenchie Network
        </Text>
      </Stack>
      <HStack
        display={{ base: 'block', md: 'flex' }}
        justifyContent="space-between"
        alignItems="start"
      >
        <Box w="100%">
          <Title mb={4}>Pages</Title>
          <List>
            <ListItem>
              <Link onClick={goTo('/')} href="/">
                Home
              </Link>
            </ListItem>
            <ListItem>
              <Link onClick={goTo('/farming')} href="/farming">
                Farming
              </Link>
            </ListItem>
          </List>
        </Box>
        <Box w="100%">
          <Title mb={4}>Useful links</Title>
          <List>
            <ListItem>
              <Link href="/whitepaper.pdf" target="_blank">
                Whitepaper
              </Link>
            </ListItem>
            <ListItem>
              <Link href={constants.pancakeSwapLink} target="_blank">
                PancakeSwap
              </Link>
            </ListItem>
            <ListItem>
              <Link href={constants.oneInchSwapLink} target="_blank">
                1inch
              </Link>
            </ListItem>
          </List>
        </Box>
        <Box w="100%">
          <Title mb={4}>The team</Title>
          <List>
            <ListItem>
              <Link href="https://spiry.ro" target="_blank">
                Spiry Capital
              </Link>
            </ListItem>
          </List>
        </Box>
        <Box w="100%">
          <Title mb={4}>Partners</Title>
          <List>
            <ListItem>
              <Link href={constants.oneInchSwapLink} target="_blank">
                1inch
              </Link>
            </ListItem>
            <ListItem>
              <Link href="https://etherauthority.io" target="_blank">
                EtherAuthority
              </Link>
            </ListItem>
          </List>
        </Box>
      </HStack>
      <Text mt={10} textAlign="center">
        Made with ❤️ by{' '}
        <Link href="https://spiry.ro" target="_blank">
          Spiry Capital
        </Link>
      </Text>
    </Container>
  );
}
