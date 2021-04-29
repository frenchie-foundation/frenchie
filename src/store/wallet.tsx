import { useToast } from '@chakra-ui/toast';
import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useMemo,
  useEffect,
} from 'react';
import Web3 from 'web3';

interface IWalletContext {
  isWeb3Enabled: boolean;
  web3: Web3;
  enableWeb3: () => Promise<void>;
  address?: string;
}

interface IWalletProvider {
  children: React.ReactNode;
}

const WalletContext = createContext<IWalletContext>({} as IWalletContext);

export const WalletProvider: React.FC<IWalletProvider> = ({
  children,
}: IWalletProvider) => {
  const [web3, setWeb3] = useState<Web3>({} as Web3);
  const [address, setAddress] = useState<string>();

  const toast = useToast();

  const isWeb3Enabled = useMemo(() => {
    if (web3.eth) {
      return true;
    }
    return false;
  }, [web3]);

  const enableWeb3 = useCallback(async () => {
    try {
      if (!isWeb3Enabled) {
        if (window.ethereum) {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          setWeb3(new Web3(window.ethereum));
        } else {
          throw new Error(
            'Could not find an injected web3. Is your wallet connected?'
          );
        }
      }
    } catch (error) {
      toast({
        status: 'error',
        description: error.message,
        title: 'Error',
        position: 'top',
        duration: 5000,
      });
    }
  }, [isWeb3Enabled, toast]);

  useEffect(() => {
    (async () => {
      if (isWeb3Enabled) {
        const [account] = await web3.eth.getAccounts();
        setAddress(account);
      }
    })();
  }, [isWeb3Enabled, web3.eth]);

  useEffect(() => {
    enableWeb3();
  }, [enableWeb3]);

  return (
    <WalletContext.Provider
      value={{
        isWeb3Enabled,
        web3,
        enableWeb3,
        address,
      }}
    >
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
