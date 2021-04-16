import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({ 
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  components: {
    Container: {
      baseStyle: {
        maxWidth: '90ch'
      }
    }
  }
});

export default theme;
