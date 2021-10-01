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
        maxWidth: '120ch',
      },
    },
    Text: {
      baseStyle: {
        color: constants.colors.light,
      },
    },
    Link: {
      baseStyle: {
        color: constants.colors.light,
      },
    },
  },
  colors: {
    white: '#FFEFCF',
  },
  fonts: {
    // eslint-disable-next-line quotes
    body: "'Inter', sans-serif",
  },
  styles: {
    global: (props: any) => ({
      '*': {
        '::-webkit-scrollbar': {
          width: '10px',
        },
        '::-webkit-scrollbar-thumb': {
          background: props.colorMode === 'dark' ? '#b4b7bd' : '#999',
          borderRadius: '5px',
          border: 'none',
        },
        '::-webkit-scrollbar-track': {
          background: props.colorMode === 'dark' ? '#3b4253' : '#eee',
          boxShadow: 'none',
        },
      },
      'html, body': {
        bg: props.colorMode === 'dark' ? 'Gray 900' : '#f4f4f4',
        minHeight: '100% ',
        '::-webkit-scrollbar-track': {
          background: props.colorMode === 'dark' ? '#3b4253' : '#eee',
          boxShadow: 'none',
        },
      },
      button: {
        _focus: {
          boxShadow: 'none !important',
        },
      },
      Flex: {
        '::-webkit-scrollbar': {
          height: '5px',
        },
        '::-webkit-scrollbar-thumb': {
          background: props.colorMode === 'dark' ? '#b4b7bd' : '#999',
          borderRadius: '5px',
          border: 'none',
        },
        '::-webkit-scrollbar-track': {
          background: props.colorMode === 'dark' ? '#3b4253' : '#eee',
          boxShadow: 'none',
        },
      },
    }),
  },
});

export default theme;
