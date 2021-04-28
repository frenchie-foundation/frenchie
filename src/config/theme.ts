import { extendTheme } from '@chakra-ui/react';
import constants from './constants';

const theme = extendTheme({ 
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  components: {
    Container: {
      baseStyle: {
        maxWidth: '120ch'
      }
    },
    Text: {
      baseStyle: {
        color: constants.colors.light
      }
    }
  },
  colors: {
    white: '#FFEFCF',
  },
  fonts: {
    body: '\'Inter\', sans-serif'
  }
});

export default theme;
