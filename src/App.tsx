import * as React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import HomePage from './pages/HomePage';
import theme from './config/theme';
import Header from './components/Header';
import Footer from './components/Footer';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

export const App: React.FC = () => (
  <ChakraProvider theme={theme}>
    <Header />
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={HomePage} />
      </Switch>
    </BrowserRouter>
    <Footer />
  </ChakraProvider>
);
