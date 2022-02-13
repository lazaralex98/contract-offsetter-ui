const fetchDepositableTokenTypes = async () => {
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

export default fetchDepositableTokenTypes;
