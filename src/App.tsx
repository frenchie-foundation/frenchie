import * as React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import HomePage from './pages/HomePage';
import theme from './config/theme';
import Header from './components/Header';
import Footer from './components/Footer';
import { WalletProvider } from './store/wallet';
import { ContractsProvider } from './store/contracts';
import FarmingPage from './pages/FarmingPage';

export const App: React.FC = () => (
  <ChakraProvider theme={theme}>
    <WalletProvider>
      <ContractsProvider>
        <BrowserRouter>
          <Header />
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/farming" component={FarmingPage} />
          </Switch>
          <Footer />
        </BrowserRouter>
      </ContractsProvider>
    </WalletProvider>
  </ChakraProvider>
);
