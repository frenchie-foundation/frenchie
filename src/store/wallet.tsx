import { Button, IconButton } from '@chakra-ui/button';
import { useDisclosure } from '@chakra-ui/hooks';
import { Image } from '@chakra-ui/image';
import { Flex, HStack, Text } from '@chakra-ui/layout';
import { Modal, ModalBody, ModalContent, ModalOverlay } from '@chakra-ui/modal';
import { useToast } from '@chakra-ui/toast';
import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useMemo,
  useEffect,
} from 'react';
import { FaTimes } from 'react-icons/fa';
import Web3 from 'web3';
import WalletConnectProvider from '@walletconnect/web3-provider';

import Title from '../components/Title';
import metamaskLogo from '../assets/images/metamask.svg';
import trustWalletLogo from '../assets/images/trust-wallet.svg';
import walletConnectLogo from '../assets/images/wallet-connect.svg';
import bscWalletLogo from '../assets/images/injected-binance.svg';
import constants from '../config/constants';

interface IWalletContext {
  isWeb3Enabled: boolean;
  web3: Web3;
  enableWeb3: (providerAPI: string) => Promise<void>;
  address?: string;
  handleOpenWalletConnection: () => void;
  disconnect: () => void;
  addFren: () => void;
}

interface IWalletProvider {
  children: React.ReactNode;
}

const WALLET_CONNECTED_ITEM = '@Frenchie/walletProviderConnected';

const WalletContext = createContext<IWalletContext>({} as IWalletContext);

interface IWalletProviderLabel {
  walletProvider: {
    name: string;
  };
  image: React.ReactElement;
}

const WalletProviderLabel: React.FC<IWalletProviderLabel> = ({
  walletProvider,
  image,
}: IWalletProviderLabel) => {
  return (
    <HStack spacing={4}>
      {image}
      <Text>{walletProvider.name}</Text>
    </HStack>
  );
};

export const WalletProvider: React.FC<IWalletProvider> = ({
  children,
}: IWalletProvider) => {
  const [web3, setWeb3] = useState<Web3>({} as Web3);
  const [address, setAddress] = useState<string>();

  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  const toast = useToast();

  const handleOpenWalletConnection = useCallback(() => {
    onModalOpen();
  }, [onModalOpen]);

  const isWeb3Enabled = useMemo(() => {
    if (web3.eth) {
      return true;
    }
    return false;
  }, [web3]);

  const enableWeb3 = useCallback(
    async (providerAPI: string) => {
      try {
        if (!isWeb3Enabled) {
          if (window[providerAPI]) {
            await window[providerAPI].request({
              method: 'eth_requestAccounts',
            });
            setWeb3(new Web3(window[providerAPI]));
            localStorage.setItem(WALLET_CONNECTED_ITEM, providerAPI);
            onModalClose();
          } else if (providerAPI === 'WalletConnect') {
            const provider = new WalletConnectProvider({
              rpc: {
                56: 'https://bsc-dataseed.binance.org',
              },
              chainId: 56,
            });
            await provider.enable();
            setWeb3(new Web3(provider as any));
            localStorage.setItem(WALLET_CONNECTED_ITEM, providerAPI);
            onModalClose();
          } else {
            throw new Error('Could not find the selected provider.');
          }
        }
      } catch (error: any) {
        toast({
          status: 'error',
          description: error.message,
          title: 'Error',
          position: 'top',
          duration: 5000,
        });
      }
    },
    [isWeb3Enabled, onModalClose, toast]
  );

  const addFren = useCallback(() => {
    const provider: any = web3.currentProvider?.valueOf();

    provider &&
      provider.sendAsync(
        {
          method: 'metamask_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address: constants.tokenAddress,
              symbol: 'FREN',
              decimals: 18,
              image: 'https://frenchie.tech/static/media/logo.6671d5da.svg',
            },
          },
          id: Math.round(Math.random() * 100000),
        },
        (err, added) => {
          console.log('provider returned', err, added);
          if (err || 'error' in added) {
            console.log('There was a problem adding the token.');
            return;
          }
          console.log('Token added!');
        }
      );
  }, [web3.currentProvider]);

  const disableWeb3 = useCallback(
    async (providerAPI: string) => {
      try {
        if (window[providerAPI]) {
          localStorage.removeItem(WALLET_CONNECTED_ITEM);
          setWeb3({} as Web3);
          onModalClose();
        } else if (providerAPI === 'WalletConnect') {
          const provider = new WalletConnectProvider({
            rpc: {
              56: 'https://bsc-dataseed.binance.org',
            },
            chainId: 56,
          });
          await provider.disconnect();
          localStorage.removeItem(WALLET_CONNECTED_ITEM);
          onModalClose();
        } else {
          throw new Error('Could not find the selected provider.');
        }
      } catch (error: any) {
        toast({
          status: 'error',
          description: error.message,
          title: 'Error',
          position: 'top',
          duration: 5000,
        });
      }
    },
    [onModalClose, toast]
  );

  const disconnect = useCallback(() => {
    const walletProvider = localStorage.getItem(WALLET_CONNECTED_ITEM);
    if (walletProvider) {
      disableWeb3(walletProvider);
    }
  }, [disableWeb3]);

  useEffect(() => {
    (async () => {
      if (isWeb3Enabled) {
        const [account] = await web3.eth.getAccounts();
        setAddress(account);
      }
    })();
  }, [isWeb3Enabled, web3.eth]);

  useEffect(() => {
    const walletProvider = localStorage.getItem(WALLET_CONNECTED_ITEM);
    if (walletProvider) {
      setTimeout(() => {
        enableWeb3(walletProvider);
      }, 1000);
    }
  }, [enableWeb3]);

  return (
    <WalletContext.Provider
      value={{
        isWeb3Enabled,
        web3,
        enableWeb3,
        address,
        handleOpenWalletConnection,
        disconnect,
        addFren,
      }}
    >
      <Modal isCentered isOpen={isModalOpen} onClose={onModalClose}>
        <ModalOverlay />
        <ModalContent>
          <Flex p={4} justifyContent="space-between" alignItems="center">
            <Title>Select a wallet provider</Title>
            <IconButton
              aria-label="close"
              icon={<FaTimes />}
              onClick={onModalClose}
            />
          </Flex>
          <ModalBody p={4}>
            <Button
              justifyContent="flex-start"
              isFullWidth
              mb={2}
              onClick={() => enableWeb3('ethereum')}
              height={16}
            >
              <WalletProviderLabel
                walletProvider={{ name: 'MetaMask' }}
                image={
                  <Image src={metamaskLogo} height={10} alt="MetaMask logo" />
                }
              />
            </Button>
            <Button
              justifyContent="flex-start"
              isFullWidth
              mb={2}
              onClick={() => enableWeb3('ethereum')}
              height={16}
            >
              <WalletProviderLabel
                walletProvider={{ name: 'Trust Wallet' }}
                image={
                  <Image
                    src={trustWalletLogo}
                    height={10}
                    alt="Trust Wallet logo"
                  />
                }
              />
            </Button>
            <Button
              justifyContent="flex-start"
              isFullWidth
              onClick={() => enableWeb3('BinanceChain')}
              height={16}
              mb={2}
            >
              <WalletProviderLabel
                walletProvider={{
                  name: 'Binance Chain Wallet',
                }}
                image={
                  <Image
                    src={bscWalletLogo}
                    height={10}
                    alt="BinanceWallet logo"
                  />
                }
              />
            </Button>
            <Button
              justifyContent="flex-start"
              isFullWidth
              onClick={() => enableWeb3('WalletConnect')}
              height={16}
            >
              <WalletProviderLabel
                walletProvider={{ name: 'WalletConnect' }}
                image={
                  <Image
                    src={walletConnectLogo}
                    height={10}
                    alt="WalletConnect logo"
                  />
                }
              />
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): IWalletContext => {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error('useWallet must be used within an WalletContext Provider');
  }

  return context;
};
