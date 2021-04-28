/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useState } from 'react';
import { Button, IconButton } from '@chakra-ui/button';
import { Container, Flex, Stack, Text, VStack } from '@chakra-ui/layout';
import { FaBars } from 'react-icons/fa';
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/modal';
import { useHistory } from 'react-router';

import constants from '../config/constants';
import { Logo } from './Logo';
import WalletInfo from './WalletInfo';

export default function Header(): React.ReactElement {
  const [drawerOpen, setDrawerOpen] = useState(false);
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

  const handleDrawerOpen = useCallback(() => {
    setDrawerOpen(true);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setDrawerOpen(false);
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
              <Button
                isFullWidth
                onClick={goTo('/')}
                bg={constants.colors.light}
                color={constants.colors.dark}
              >
                Home
              </Button>
              <Button
                isFullWidth
                onClick={goTo('/farming')}
                bg={constants.colors.light}
                color={constants.colors.dark}
              >
                Farming
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <Flex pt={8} pb={8} justifyContent="space-between">
        <Stack spacing={2} display="flex" direction="row" alignItems="center">
          <IconButton
            variant="outline"
            aria-label="Menu"
            icon={
              <FaBars
                color={constants.colors.light}
                width={24}
                height={24}
                size={24}
              />
            }
            onClick={handleDrawerOpen}
          />
          <Logo height={9} />
          <Text fontSize={24} color={constants.colors.light} fontWeight="bold">
            Frenchie Network
          </Text>
        </Stack>
        <WalletInfo alignSelf="end" />
      </Flex>
    </Container>
  );
}
