import * as React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import theme from './config/theme';
import Header from './components/Header';
import Footer from './components/Footer';
import { WalletProvider } from './store/wallet';
import { ContractsProvider } from './store/contracts';
import { Provider } from 'react-redux';
import store from './state';
import HomePage from './pages/HomePage';
import FarmingPage from './pages/FarmingPage';
import SwapPage from './pages/SwapPage';

export const App: React.FC = () => (
  
  <Provider store={store}>
  <ChakraProvider theme={theme}>
    <WalletProvider>
      <ContractsProvider>
        <BrowserRouter>
          <Header />
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/farming" component={FarmingPage} />
            <Route exact path="/swap" component={SwapPage} />
          </Switch>
          <Footer />
        </BrowserRouter>
      </ContractsProvider>
    </WalletProvider>
  </ChakraProvider>
  </Provider>
);
