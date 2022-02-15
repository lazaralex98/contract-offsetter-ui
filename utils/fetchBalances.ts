import * as coAbi from "../contract-utils/ContractOffsetter.json";
import * as bctAbi from "../contract-utils/BaseCarbonTonne.json";
import { ethers } from "ethers";
import ifcBalance from "./ifcBalance";
import { ifcTokenType } from "./fetchDepositableTokenTypes";
import { BaseCarbonTonne } from "../contract-utils/BaseCarbonTonne";

const fetchBalances = async (
  DepositableTokenTypes: ifcTokenType[],
  wallet: string
): Promise<ifcBalance[]> => {
  // @ts-ignore
  const { ethereum } = window;
  if (!ethereum) {
    throw new Error("You need Metamask.");
  }

  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();

  // get portal to ContractOffsetter
  // @ts-ignore
  const co: ContractOffsetter = new ethers.Contract(
    process.env.NEXT_PUBLIC_CONTRACT_OFFSETTER_ADDRESS_MUMBAI || "",
    coAbi.abi,
    signer
  );

  // @ts-ignore
  const bct: BaseCarbonTonne = new ethers.Contract(
    process.env.NEXT_PUBLIC_BCT_ADDRESS_MUMBAI || "",
    bctAbi.abi,
    signer
  );

  // fetch the balance of each token from the blockchain
  const balances = await Promise.all(
    DepositableTokenTypes.map(async (tokenType) => {
      const balance = ethers.utils.formatEther(
        await co.balances(wallet, tokenType.address)
      );
      const bctPoolBalance = ethers.utils.formatEther(
        await bct.tokenBalances(tokenType.address)
      );
      // TODO also fetch and returns the user's wallet balance of each token maybe?
      return { ...tokenType, balance, bctPoolBalance };
    })
  );
  return balances;
};

export default fetchBalances;
