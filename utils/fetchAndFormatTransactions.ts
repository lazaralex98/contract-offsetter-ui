import fetchNonceOfLastOffset from "./fetchNonceOfLastOffset";
import { ifcFormattedTransaction, ifcTransaction } from "./ifcTransaction";

const fetchAndFormatTransactions = async (
  address: string
): Promise<ifcFormattedTransaction[]> => {
  // fetch transactions (there's a 10k Txn limit)
  let response = await fetch(
    `/api/getTransactionsOfAddress?address=${address}`
  );
  let data: any = await response.json();
  if (data.message != "OK") throw new Error(data.message);

  /**
   * @description reruns fetch until we have an array with all the transactions
   * @reason we do this so we can bypass the 10k Txn limit per API call
   * @param initialTransactions transactions from the first fetch we ran
   */
  let allTransactions: ifcTransaction[] = data.data.result;
  const recursiveFunction = async (initialTransactions: ifcTransaction[]) => {
    // if the length is a multiple of 10k, it means the last fetch hit the limit
    if (initialTransactions.length % 10000 == 0) {
      // fetch
      let response = await fetch(
        `/api/getTransactionsOfAddress?address=${address}&endBlock=${
          initialTransactions.at(-1)?.blockNumber
        }`
      );
      let data: any = await response.json();
      if (data.message != "OK") throw new Error(data.message);

      // join new transactions with the ones previously fetched
      allTransactions = [...initialTransactions, ...data.data.result];

      // run again
      await recursiveFunction(allTransactions);
    }
  };
  await recursiveFunction(allTransactions);

  const nonceOflastOffset = await fetchNonceOfLastOffset(address);

  const formattedTransactions: ifcFormattedTransaction[] = await Promise.all(
    allTransactions
      .filter((transaction) => {
        // filter out transactions with incomplete data
        return (
          transaction.hash &&
          transaction.gasUsed &&
          transaction.nonce &&
          transaction.txreceipt_status
        );
      })
      .map(async (transaction: ifcTransaction) => {
        const formattedTransaction: ifcFormattedTransaction = {
          hash: transaction.hash,
          gasUsed: transaction.gasUsed,
          nonce: transaction.nonce,
          transactionStatus: transaction.txreceipt_status,
          // if the nonce of the last offset is bigger/equal than nonce, the transaction has been offset
          offsetStatus: Number(nonceOflastOffset) >= Number(transaction.nonce),
        };
        return formattedTransaction;
      })
  );
  return formattedTransactions;
};

export default fetchAndFormatTransactions;
