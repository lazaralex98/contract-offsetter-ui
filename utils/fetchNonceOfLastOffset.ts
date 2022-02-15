import { ethers } from "ethers";
import * as coAbi from "../contract-utils/ContractOffsetter.json";
import { ContractOffsetter } from "../contract-utils/ContractOffsetter";

/**
 * @param address address of transaction owner
 * @returns the nonce of the last offset transaction for this address
 */
const fetchNonceOfLastOffset = async (address: string): Promise<string> => {
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
    const lastOffsetNonce = ethers.utils.formatEther(
      await co.lastOffsetNonce(address)
    );

    return lastOffsetNonce;
  } catch (error: any) {
    console.error("error when fetching nonce of last offset", error);
    return "0";
  }
};

export default fetchNonceOfLastOffset;
