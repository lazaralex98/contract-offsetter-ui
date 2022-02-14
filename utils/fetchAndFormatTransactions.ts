import fetchOffsetStatus from "./fetchOffsetStatus";
import { ifcFormattedTransaction, ifcTransaction } from "./ifcTransaction";

const fetchAndFormatTransactions = async (
  address: string
): Promise<ifcFormattedTransaction[]> => {
  // get transactions (there's a 10k Txn limit)
  let response = await fetch(
    `/api/getTransactionsOfAddress?address=${address}`
  );
  let data: any = await response.json();
  if (data.message != "OK") throw new Error(data.message);

  /**
   * @description checks if there are 10k Txns and if so reruns fetch until we have an array with all the transactions
   * @reason we do this so we can bypass the 10k Txn limit per API call
   * @param initialTransactions transactions from the first fetch we ran
   */
  let allTransactions: ifcTransaction[] = data.data.result;
  const recursiveFunction = async (
    initialTransactions: ifcTransaction[]
  ): Promise<ifcTransaction[]> => {
    if (initialTransactions.length % 10000 == 0) {
      let response = await fetch(
        `/api/getTransactionsOfAddress?address=${address}&endBlock=${initialTransactions[9999].blockNumber}`
      );
      let data: any = await response.json();
      if (data.message != "OK") throw new Error(data.message);
      allTransactions = [...initialTransactions, data.data.result];

      // run again
      if (allTransactions.length % 10000 == 0) {
        recursiveFunction(allTransactions);
      }
    }
    return allTransactions;
  };
  recursiveFunction(allTransactions);

  const formattedTransactions: ifcFormattedTransaction[] = await Promise.all(
    allTransactions.map(async (transaction: ifcTransaction) => {
      // TODO ISSUE PROBLEM JsonRpc issues start happening when trying to fetch data for a lot of transactions
      // solution, use a lastOffsetNonce instead of having a status for each transaction
      // const offsetStatus = await fetchOffsetStatus(address, transaction.nonce);
      const offsetStatus = false;

      const formattedTransaction: ifcFormattedTransaction = {
        hash: transaction.hash,
        gasUsed: transaction.gasUsed,
        nonce: transaction.nonce,
        transactionStatus: transaction.txreceipt_status,
        offsetStatus: offsetStatus,
      };
      return formattedTransaction;
    })
  );
  return formattedTransactions;
};

export default fetchAndFormatTransactions;
