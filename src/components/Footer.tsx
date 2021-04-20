import { Container, Link, Text } from '@chakra-ui/layout';
import React from 'react';
import constants from '../config/constants';

export default function Footer(): React.ReactElement {
  return (
    <Container mt={20} mb={20}>
      <Text textAlign="center" mb={10}>
        Contract address:{' '}
        <Link
          href="https://bscscan.com/token/0x13958e1eb63dfb8540eaf6ed7dcbbc1a60fd52af"
          target="__blank"
        >
          {constants.tokenAddress}
        </Link>
      </Text>
      <Text>
        Disclaimer: The information provided shall not in any way constitute a
        recommendation as to whether you should invest in any product discussed.
        FRENCHIE TOKEN accepts no liability for any loss occasioned to any
        person acting or refraining from action as a result of any material
        provided or published.
      </Text>
      <Text mt={10} textAlign="center">
        Made with ❤️ by{' '}
        <Link href="https://spiry.ro" target="__blank">
          Spiry Capital
        </Link>
      </Text>
    </Container>
  );
}
