/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useState } from 'react';
import { Flex, HStack, Stack, Text, VStack } from '@chakra-ui/layout';
import constants from '../config/constants';
import { Logo } from './Logo';
import WalletInfo from './WalletInfo';
import { Button, IconButton } from '@chakra-ui/button';
import { openLink } from '../helpers/openInNewTab';
import { FaBars, FaHome, FaSync, FaTractor } from 'react-icons/fa';
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/modal';

export default function Header(): React.ReactElement {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleFarmClick = useCallback((e?: any) => {
    if (e) {
      e.preventDefault();
    }
    openLink('/farming');
  }, []);

  const handleBuyLinkClick = useCallback(() => {
    openLink('/swap');
  }, []);

  const goTo = useCallback(
    (path: string) => (e?: any) => {
      setDrawerOpen(false);
      if (e) {
        e.preventDefault();
      }
      openLink(path);
    },
    []
  );

  const handleDrawerOpen = useCallback(() => {
    setDrawerOpen(true);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  return (
    <Flex
      py={2}
      justifyContent="space-between"
      position="sticky"
      top="0"
      bg="gray.800"
      zIndex="999"
      maxW="120ch"
      margin="0 auto"
      px={{ base: 4, xl: 0 }}
    >
      <Drawer placement="left" onClose={handleDrawerClose} isOpen={drawerOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton mt={2} />
          <DrawerHeader
            borderBottomWidth="1px"
            mb={4}
            display="flex"
            alignItems="center"
            gridGap={2}
          >
            <Logo w={8} />
            Frenchie Network
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={4}>
              <Button
                isFullWidth
                onClick={goTo('/')}
                bg={constants.colors.light}
                color={constants.colors.dark}
                leftIcon={<FaHome />}
                justifyContent="flex-start"
              >
                Home
              </Button>
              <Button
                isFullWidth
                onClick={goTo('/farming')}
                bg={constants.colors.light}
                color={constants.colors.dark}
                leftIcon={<FaTractor />}
                justifyContent="flex-start"
              >
                Farm
              </Button>
              <Button
                isFullWidth
                onClick={goTo('/swap')}
                bg={constants.colors.light}
                color={constants.colors.dark}
                leftIcon={<FaSync />}
                justifyContent="flex-start"
              >
                Frenchie Swap
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <Stack spacing={2} display="flex" direction="row" alignItems="center">
        <IconButton
          display={{ base: 'flex', xl: 'none' }}
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
        <Flex
          direction="row"
          alignItems="center"
          onClick={goTo('/')}
          cursor="pointer"
        >
          <Logo height={12} />
          <Text
            fontSize={{ xl: 28, md: 24 }}
            display={{ base: 'none', md: 'block' }}
            color={constants.colors.light}
            fontWeight="bold"
          >
            Frenchie Network
          </Text>
        </Flex>
      </Stack>
      <HStack spacing={5}>
        <Flex
          gridGap={4}
          alignItems="center"
          display={{ base: 'none', xl: 'flex' }}
        >
          <Button
            variant="outline"
            px={5}
            py={5}
            onClick={handleBuyLinkClick}
            bgColor={constants.colors.darkerLight}
            color={constants.colors.dark}
            transition="0.2s"
            _hover={{
              boxShadow: 'xl',
            }}
          >
            Frenchie Swap
          </Button>
          <Button
            variant="outline"
            color={constants.colors.white}
            borderColor={constants.colors.white}
            px={5}
            py={5}
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
        <WalletInfo />
      </HStack>
    </Flex>
  );
}
