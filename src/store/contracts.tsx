import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { Contract } from 'web3-eth-contract';
import erc20abi from 'erc-20-abi';

import FrenchieContract from '../assets/contracts/Frenchie.json';
import FarmContract from '../assets/contracts/Farm.json';
import OneInchLPABI from '../assets/contracts/1InchLP.json';
import PancakeRouterABI from '../assets/contracts/PancakeRouter.json';
import PancakeFactoryABI from '../assets/contracts/PancakeFactory.json';

import { AbiItem } from '../types';
import { useWallet } from './wallet';
import constants from '../config/constants';

interface IContractsContext {
  frenToken?: Contract;
  farmContract?: Contract;
  oneInch?: Contract;
  pancakeRouter?: Contract;
  pancakeFactory?: Contract;
  erc20: (address: string) => Contract | undefined;
  loadContract: (abi: unknown, address: string) => Contract | undefined;
}

interface IContractsProvider {
  children: React.ReactNode;
}

const ContractsContext = createContext<IContractsContext>(
  {} as IContractsContext
);

export const ContractsProvider: React.FC<IContractsProvider> = ({
  children,
}: IContractsProvider) => {
  const { web3, isWeb3Enabled } = useWallet();

  const loadContract = useCallback(
    (abi: unknown, address: string): Contract | undefined => {
      if (web3.eth) {
        const contract = new web3.eth.Contract(abi as AbiItem, address);
        return contract;
      }
      return undefined;
    },
    [web3.eth]
  );

  const frenToken = useMemo(() => {
    if (isWeb3Enabled) {
      return loadContract(FrenchieContract.abi, constants.tokenAddress);
    }
    return undefined;
  }, [loadContract, isWeb3Enabled]);

  const farmContract = useMemo(() => {
    if (isWeb3Enabled) {
      return loadContract(FarmContract.abi, constants.farmAddress);
    }
    return undefined;
  }, [isWeb3Enabled, loadContract]);

  const oneInch = useMemo(() => {
    if (isWeb3Enabled) {
      return loadContract(OneInchLPABI, constants.oneInchLPAddress);
    }
    return undefined;
  }, [isWeb3Enabled, loadContract]);

  const pancakeRouter = useMemo(() => {
    if (isWeb3Enabled) {
      return loadContract(PancakeRouterABI, constants.pancakeRouterAddress);
    }
    return undefined;
  }, [isWeb3Enabled, loadContract]);

  const pancakeFactory = useMemo(() => {
    if (isWeb3Enabled) {
      return loadContract(PancakeFactoryABI, constants.pancakeFactoryAddress);
    }
    return undefined;
  }, [isWeb3Enabled, loadContract]);

  const erc20 = useMemo(() => {
    return (address: string) => {
      if (isWeb3Enabled) {
        return loadContract(erc20abi, address);
      }
      return undefined;
    };
  }, [isWeb3Enabled, loadContract]);

  return (
    <ContractsContext.Provider
      value={{
        frenToken,
        farmContract,
        oneInch,
        loadContract,
        pancakeRouter,
        pancakeFactory,
        erc20,
      }}
    >
      {children}
    </ContractsContext.Provider>
  );
};

export const useContracts = (): IContractsContext => {
  const context = useContext(ContractsContext);

  if (!context) {
    throw new Error(
      'useContracts must be used within an ContractsContext Provider'
    );
  }

  return context;
};
