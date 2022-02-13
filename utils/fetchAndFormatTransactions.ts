import fetchOffsetStatus from "./fetchOffsetStatus";
import { ifcFormattedTransaction, ifcTransaction } from "./ifcTransaction";

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
