import React, { useEffect } from 'react';
import { Box, Container, Flex } from '@chakra-ui/layout';
import Title from '../components/Title';
import constants from '../config/constants';
import Swap from '../components/Swap';

export default function SwapPage(): React.ReactElement {
  useEffect(() => {
    document.title = 'Swap - Frenchie Network';
  }, []);

  return (
    <Container>
      <Box mt={16} mb={10}>
        <Title lineHeight="48px" isPageTitle>
          Swap
        </Title>
        <Title isPageTitle color={constants.colors.red}>
          Buy {'&'} Sell FREN
        </Title>
      </Box>
      <Flex justifyContent="center">
        <Swap />
      </Flex>
    </Container>
  );
}
