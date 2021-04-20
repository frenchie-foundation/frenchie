import { Button, IconButton } from '@chakra-ui/button';
import { Container, Flex, Stack } from '@chakra-ui/layout';
import React, { useCallback } from 'react';
import { FaTelegram } from 'react-icons/fa';

import constants from '../config/constants';
import openInNewTab from '../helpers/openInNewTab';
import { ColorModeSwitcher } from './ColorModeSwitcher';

import BscLogo from '../assets/bscscan-logo-circle.svg';
import { Image } from '@chakra-ui/image';

export default function Header(): React.ReactElement {
  const handlePancakeSwapLinkClick = useCallback(() => {
    openInNewTab(constants.pancakeSwapLink);
  }, []);

  const handleTelegramLinkClick = useCallback(() => {
    openInNewTab(constants.telegramGroupLink);
  }, []);

  const handleBscScanLinkClick = useCallback(() => {
    openInNewTab(constants.bscScanLink);
  }, []);

  return (
    <Container>
      <Flex pt={8} pb={8} justifyContent="space-between">
        <Stack spacing={2} direction="row">
          <Button colorScheme="red" onClick={handlePancakeSwapLinkClick}>
            Buy on PancakeSwap
          </Button>
          <IconButton
            colorScheme="telegram"
            aria-label="Telegram group"
            icon={<FaTelegram />}
            onClick={handleTelegramLinkClick}
          />
          <IconButton
            colorScheme="teal"
            aria-label="Telegram group"
            icon={<Image src={BscLogo} height={4} />}
            onClick={handleBscScanLinkClick}
          />
        </Stack>
        <ColorModeSwitcher justifySelf="flex-end" />
      </Flex>
    </Container>
  );
}
