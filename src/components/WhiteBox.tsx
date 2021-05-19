import React from 'react';
import { Box } from '@chakra-ui/layout';
import { ChakraProps } from '@chakra-ui/system';

import constants from '../config/constants';

interface IWhiteBox extends ChakraProps {
  children?: React.ReactNode;
}

const WhiteBox: React.FC<IWhiteBox> = ({ children, ...props }: IWhiteBox) => {
  return (
    <Box
      bg="white"
      color={constants.colors.dark}
      p={15}
      borderRadius={5}
      {...props}
    >
      {children}
    </Box>
  );
};

export default WhiteBox;
