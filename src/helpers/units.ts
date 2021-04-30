export function toWei(value: number): string {
  return (value * 10 ** 18).toFixed();
}

export function toEther(value: number | string): number {
  return Number(value) * 10 ** -18;
}
