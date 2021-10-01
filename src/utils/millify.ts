import BigNumber from 'bignumber.js';

export default function millify(num: BigNumber): string {
  const [str] = num.toString().split('.');
  const { length } = str;
  const baseAmount = length % 3 || 3;
  const bases = ['', 'K', 'M', 'B', 'T', 'QD', 'QN', 'SX', 'SP'];
  const baseIndex = Math.floor((length - 1) / 3);
  const base = bases[baseIndex];
  const major = str.substr(0, baseAmount);
  const minor = str.substr(baseAmount, 1);
  const showMinor = minor && minor !== '0';

  return `${major}${showMinor ? `.${minor}` : ''}${base}`;
}
