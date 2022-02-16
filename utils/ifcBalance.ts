interface ifcBalance {
  __typename: string;
  address: string;
  name: string;
  symbol: string;
  balance: string; // in tonnes
  bctPoolBalance: string;
}

export default ifcBalance;
