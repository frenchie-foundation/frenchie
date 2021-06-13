import addresses from '../config/contracts';

const chainId = process.env.REACT_APP_CHAIN_ID;

export const getFrenAddress = () => {
  return addresses.fren[chainId];
};
export const getFrenFarm = () => {
  return addresses.FrenFarm[chainId];
};
export const getMulticallAddress = () => {
  return addresses.mulltiCall[chainId];
};
export const getWbnbAddress = () => {
  return addresses.wbnb[chainId];
};
export const getLotteryAddress = () => {
  return addresses.lottery[chainId];
};
export const getLotteryTicketAddress = () => {
  return addresses.lotteryNFT[chainId];
};