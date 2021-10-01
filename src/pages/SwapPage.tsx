import React, { useCallback, useEffect } from 'react';
import { Box, Container, Flex } from '@chakra-ui/layout';
import Title from '../components/Title';
import constants from '../config/constants';
import Swap from '../components/Swap';
import { openLink } from '../helpers/openInNewTab';
import { Button } from '@chakra-ui/react';
import { FaHome, FaTractor } from 'react-icons/fa';

export default function SwapPage(): React.ReactElement {
  useEffect(() => {
    document.title = 'Swap - Frenchie Network';
  }, []);

  const handleFarmClick = useCallback((e?: any) => {
    if (e) {
      e.preventDefault();
    }
    openLink('/farming');
  }, []);

  const handleHomeClick = useCallback((e?: any) => {
    if (e) {
      e.preventDefault();
    }
    openLink('/');
  }, []);

  return (
    <Container>
      <Box mt={16} mb={10}>
        <Title lineHeight="48px" isPageTitle>
          Frenchie Swap
        </Title>
        <Title isPageTitle color={constants.colors.red} mb={4}>
          Buy {'&'} Sell FREN
        </Title>
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
            leftIcon={<FaTractor />}
            onClick={handleFarmClick}
            transition="0.2s"
            _hover={{
              boxShadow: 'xl',
            }}
          >
            Farm
          </Button>
        </Flex>
      </Box>
      <Flex justifyContent="center">
        <Swap />
      </Flex>
    </Container>
  );
}
