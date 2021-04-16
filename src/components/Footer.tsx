import { Container, Text } from '@chakra-ui/layout';
import React from 'react';

export default function Footer(): React.ReactElement {
  return (
    <Container mt={20} mb={20}>
      <Text>
        Disclaimer: The information provided shall not in any way constitute a
        recommendation as to whether you should invest in any product discussed.
        FRENCHIE TOKEN accepts no liability for any loss occasioned to any
        person acting or refraining from action as a result of any material
        provided or published.
      </Text>
    </Container>
  );
}
