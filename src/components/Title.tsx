import React from 'react';

import { Text } from '@chakra-ui/layout';
import { ChakraProps } from '@chakra-ui/system';

interface ITitle extends ChakraProps {
  children: React.ReactNode;
  isPageTitle?: boolean;
  isSecondary?: boolean;
}

const Title: React.FC<ITitle> = ({
  children,
  isPageTitle,
  isSecondary,
  ...props
}: ITitle) => {
  return (
    <Text
      fontWeight="bold"
      color="white"
      {...(isPageTitle
        ? {
            fontSize: {
              base: '48px',
              md: '72px',
            },
          }
        : isSecondary
        ? {
            fontSize: '32px',
          }
        : {
            fontSize: '24px',
          })}
      {...props}
    >
      {children}
    </Text>
  );
};

export default Title;
