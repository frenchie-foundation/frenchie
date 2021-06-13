import React from 'react';
import { Modal } from '@chakra-ui/react';
// import bsc, { UseWalletProvider } from '@binance-chain/bsc-use-wallet';
import * as bsc from '@binance-chain/bsc-use-wallet';
import { Provider } from 'react-redux';
import getRpcUrl from './utils/getRpcUrl';

import { RefreshContextProvider } from './contexts/RefreshContext';
import store from './state';

const Providers: React.FC = ({ children }) => {
  const rpcUrl = getRpcUrl();
  const chainId = parseInt(process.env.REACT_APP_CHAIN_ID);
  return (
    <Provider store={store}>

          <bsc.UseWalletProvider
            chainId={chainId}
            connectors={{
              walletconnect: { rpcUrl },
              bsc,
            }}
          >

              <RefreshContextProvider>
                <Modal>{children}</Modal>
              </RefreshContextProvider>

          </bsc.UseWalletProvider>


    </Provider>
  );
};

export default Providers;