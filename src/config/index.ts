import BigNumber from 'bignumber.js/bignumber';

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});

export const FREN_PER_BLOCK = (5000);
export const BLOCKS_PER_YEAR = new BigNumber(10512000);

export const BSC_BLOCK_TIME = 3;
export const BSC_BLOCKS_PER_DAY = 28800;
export const FREN_POOL_PID = 0;