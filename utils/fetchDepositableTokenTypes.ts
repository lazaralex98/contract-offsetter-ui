interface ifcTokenType {
  __typename: string;
  address: string;
  name: string;
  symbol: string;
}

const fetchDepositableTokenTypes = async (): Promise<ifcTokenType[]> => {
  const response = await fetch(`/api/getAllTCO2Types`);
  const data: any = await response.json();

  // preparing tokens to check/display in an easily formattable way
  const tokensToCheck = [
    ...data,
    {
      __typename: "BaseCarbonTonne",
      address: process.env.NEXT_PUBLIC_BCT_ADDRESS_MUMBAI,
      name: "Toucan Protocol: Base Carbon Tonne",
      symbol: "BCT",
    },
  ];
  return tokensToCheck;
};

export type { ifcTokenType };

export default fetchDepositableTokenTypes;
