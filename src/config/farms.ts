import contracts from './contracts';
import { FarmConfig, QuoteToken } from './types';

const farms: FarmConfig[] = [
 
  {
    // FIXME:
    pid: 0,
    risk: 2,
    lpSymbol: 'FREN-BNB',
    lpAddresses: {
      56: '0xe01245e737fcc14ba053ecfe6d10eda070b5a8f9', // FIXME:
    },
    tokenSymbol: 'FREN',
    tokenAddresses: {
      56: '0x13958e1eb63dfb8540eaf6ed7dcbbc1a60fd52af',
    },
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
  }
];

export default farms;