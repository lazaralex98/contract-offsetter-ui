import * as coAbi from "../contract-utils/ContractOffsetter.json";
import { ethers } from "ethers";
import ifcBalance from "./ifcBalance";
import { ifcTokenType } from "./fetchDepositableTokenTypes";

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

  // fetch the balance of each token from the blockchain
  const balances = await Promise.all(
    DepositableTokenTypes.map(async (tokenType) => {
      const balance = ethers.utils.formatEther(
        await co.balances(wallet, tokenType.address)
      );
      return { ...tokenType, balance };
    })
  );
  return balances;
};

export default fetchBalances;
