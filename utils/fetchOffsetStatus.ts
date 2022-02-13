import { ethers } from "ethers";
import * as coAbi from "../contract-utils/ContractOffsetter.json";

/**
 * attempts to fetch the offset status of one transaction
 * @param address address of transaction owner
 * @param nonce nonce of transaction
 * @returns true/false (wether the transaction has been offset)
 */
const fetchOffsetStatus = async (address: string, nonce: string) => {
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

    // get offset status of for the specified address for its specified nonce
    const offsetStatus = await co.nonceStatuses(
      address,
      ethers.utils.parseEther(nonce)
    );

    return offsetStatus;
  } catch (error: any) {
    console.error("error when fetching offset status", error);
  }
};

export default fetchOffsetStatus;
