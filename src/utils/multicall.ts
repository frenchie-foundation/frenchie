import { AbiItem } from 'web3-utils';
import { Interface } from '@ethersproject/abi';
import  Web3  from 'web3';
import MultiCallAbi from '../assets/contracts/MultiCall.json';
import { getMulticallAddress } from '../utils/addressHelpers';

interface Call {
  address: string // Address of the contract
  name: string // Function name on the contract (exemple: balanceOf)
  params?: any[] // Function params
}

const multicall = async (abi: any[], calls: Call[]) => {
  const web3 = new Web3();
  const multi = new web3.eth.Contract((MultiCallAbi as unknown) as AbiItem, getMulticallAddress());
  const itf = new Interface(abi);

  const calldata = calls.map((call) => [call.address.toLowerCase(), itf.encodeFunctionData(call.name, call.params)]);
  const { returnData } = await multi.methods.aggregate(calldata).call();
  const res = returnData.map((call, i) => itf.decodeFunctionResult(calls[i].name, call));

  return res;
};

export default multicall;