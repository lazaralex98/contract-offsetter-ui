import fetchOffsetStatus from "./fetchOffsetStatus";
import { ifcFormattedTransaction, ifcTransaction } from "./ifcTransaction";

// TODO PROBLEM NOTE WARNING the API endpoint returns a maximum of 10,000 records only
const fetchAndFormatTransactions = async (
  address: string
): Promise<ifcFormattedTransaction[]> => {
  const response = await fetch(
    `/api/getTransactionsOfAddress?address=${address}`
  );
  const data: any = await response.json();
  if (data.message != "OK") throw new Error(data.message);

  const formattedTransactions: ifcFormattedTransaction[] = await Promise.all(
    data.data.result.map(async (transaction: ifcTransaction) => {
      // TODO ISSUE PROBLEM JsonRpc issues start happening when trying to fetch data for 10k transactions
      const offsetStatus = await fetchOffsetStatus(address, transaction.nonce);

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
