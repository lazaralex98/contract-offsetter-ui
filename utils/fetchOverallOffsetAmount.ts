import { ethers } from "ethers";
import * as coAbi from "../contract-utils/ContractOffsetter.json";
import { ContractOffsetter } from "../contract-utils/ContractOffsetter";

const fetchOverallOffsetAmount = async (address: string) => {
  try {
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

    // get last offset nonce of the specified address and make it a string
    const offsetAmount = ethers.utils.formatEther(
      await co.overallOffsetAmount(address)
    );

    return offsetAmount;
  } catch (error: any) {
    console.error("error when fetching overallOffsetAmount", error);
    return "0";
  }
};

export default fetchOverallOffsetAmount;
