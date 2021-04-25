import { Button, IconButton } from '@chakra-ui/button';
import { Container, Flex, Stack, VStack } from '@chakra-ui/layout';
import React, { useCallback, useState } from 'react';
import { FaBars, FaTelegram } from 'react-icons/fa';

import constants from '../config/constants';
import openInNewTab from '../helpers/openInNewTab';
import { ColorModeSwitcher } from './ColorModeSwitcher';

import BscLogo from '../assets/bscscan-logo-circle.svg';
import { Image } from '@chakra-ui/image';
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/modal';
import { useHistory } from 'react-router';

export default function Header(): React.ReactElement {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const history = useHistory();

  const goTo = useCallback(
    (path: string) => () => {
      history.push(path);
    },
    []
  );

  const handleDrawerOpen = useCallback(() => {
    setDrawerOpen(true);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setDrawerOpen(false);
  }, []);

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
      <Drawer placement="left" onClose={handleDrawerClose} isOpen={drawerOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton mt={2} />
          <DrawerHeader borderBottomWidth="1px" mb={4}>
            Menu
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={4}>
              <Button isFullWidth onClick={goTo('/')}>
                Home page
              </Button>
              <Button isFullWidth onClick={goTo('/staking')}>
                Staking
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <Flex pt={8} pb={8} justifyContent="space-between">
        <Stack spacing={2} direction="row">
          <IconButton
            backgroundColor="white"
            aria-label="Menu"
            icon={<FaBars color="black" />}
            onClick={handleDrawerOpen}
          />
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
