import { ethers } from "ethers";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AppNavbar from "../components/AppNavbar";
import { Loader } from "../components/Loader";
import toastOptions from "../utils/toastOptions";
import * as coAbi from "../contract-utils/ContractOffsetter.json";
import { ContractOffsetter } from "../contract-utils/ContractOffsetter";
import ConnectWalletAlert from "../components/ConnectWalletAlert";
import ifcPropsFromApp from "../utils/ifcPropsFromApp";

interface ifcTransaction {
  blockHash: string;
  blockNumber: string;
  confirmations: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  from: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  hash: string;
  input: string;
  isError: string;
  nonce: string;
  timeStamp: string;
  to: string;
  transactionIndex: string;
  txreceipt_status: string;
  value: string;
}

interface ifcFormattedTransaction {
  hash: string;
  gasUsed: string;
  nonce: string;
  transactionStatus: string;
  offsetStatus: boolean | undefined;
}

// @ts-ignore some type props BS i don't have the time to look into right now
const Dashboard: NextPage = ({
  wallet,
  connectWallet,
  loading,
  setLoading,
}: ifcPropsFromApp) => {
  const [transactions, setTransactions] = useState<
    ifcFormattedTransaction[] | null
  >(null);
  const [overallGas, setOverallGas] = useState<number>(0);
  const [overallEmmissions, setOverallEmmissions] = useState<number>(0);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", current: true },
    { name: "Deposit", href: "/deposit", current: false },
    { name: "Redeem", href: "/redeem", current: false },
    { name: "Help", href: "/help", current: false },
  ];
  const userNavigation = [
    {
      name: "Your wallet",
      href: `https://mumbai.polygonscan.com/address/${wallet}`,
    },
    { name: "Disconnect", href: "/disconnect" },
  ];

  /**
   * fetches an array of transactions for the given address
   * @param address address of user/contract to fetch transactions for
   * @issue the API endpoint returns a maximum of 10,000 records only
   */
  const fetchTransactionsOfAddress = async (address: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/getTransactionsOfAddress?address=${address}`
      );
      const data: any = await response.json();
      if (data.message != "OK") throw new Error(data.message);

      calculateOverallGas(data.data.result);
      calculateOverallFootprint(data.data.result);

      const formattedTransactions = await Promise.all(
        data.data.result.map(async (transaction: ifcTransaction) => {
          const offsetStatus = await fetchOffsetStatus(
            wallet,
            transaction.nonce
          );

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

      setTransactions(formattedTransactions);
    } catch (error: any) {
      toast.error(error.message, toastOptions);
    } finally {
      setLoading(false);
    }
  };

  /**
   * attempts to fetch the offset status of one transaction
   * @param address address of transaction owner
   * @param nonce nonce of transaction
   * @returns true/false (wether the transaction has been offset)
   */
  const fetchOffsetStatus = async (address: string, nonce: string) => {
    try {
      if (!wallet) {
        throw new Error("Connect your wallet first.");
      }

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

  /**
   * calculates overall gas used and stores it in React state
   * @param transactions an array of unformatted transactions
   */
  const calculateOverallGas = (transactions: ifcTransaction[]) => {
    let overallGas: number = 0;
    transactions?.forEach((transaction) => {
      overallGas += parseInt(transaction.gas);
    });
    setOverallGas(overallGas);
  };

  /**
   * calculates the overall footprint (based on transaction number) and stores it in React state
   * @param transactions an array of unformatted transactions
   */
  const calculateOverallFootprint = (transactions: ifcTransaction[]) => {
    const overallFootprint: number = transactions?.length * 0.00036; // 0.00000036 TCO2 or 0.00036 kg per transaction
    setOverallEmmissions(overallFootprint);
  };

  const offsetAll = async (tco2Address: string) => {
    // TODO offset all transactions
    try {
      if (!wallet) {
        throw new Error("Connect your wallet first.");
      }

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

      const noncesBigNumberish = transactions?.map((transaction) => {
        return ethers.utils.parseEther(transaction.nonce);
      });

      // get offset status of for the specified address for its specified nonce
      const offsetTxn = await co.offset(
        tco2Address,
        ethers.utils.parseEther(String(overallEmmissions / 1000)),
        wallet,
        noncesBigNumberish || []
      );
      await offsetTxn.wait();

      fetchTransactionsOfAddress(wallet);
    } catch (error: any) {
      console.error("error when fetching offset status", error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!wallet) {
    return <ConnectWalletAlert connectWallet={connectWallet} />;
  }

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <div className="min-h-full">
        <AppNavbar
          wallet={wallet}
          userNavigation={userNavigation}
          navigation={navigation}
        />
        <div className="py-10">
          <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold leading-tight text-gray-900">
                Dashboard
              </h1>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Link href="/offset/">
                <a
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Want to offset another address?
                </a>
              </Link>
              {transactions ? (
                <button
                  onClick={() => {
                    offsetAll();
                  }}
                  type="button"
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Offset All
                </button>
              ) : (
                ""
              )}
            </div>
          </header>
          <main>
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
              {/* Replace with your content */}
              <div className="px-4 py-8 sm:px-0">
                {/* show overall gas and emmissions stats */}
                {overallGas || overallEmmissions ? (
                  <div className="mb-6">
                    <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                      <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Overall Gas Used
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">
                          {Intl.NumberFormat("en-US").format(overallGas) + " "}
                          wei
                        </dd>
                      </div>
                      <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Overall CO2 Emmissions
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">
                          {overallEmmissions} kg
                        </dd>
                      </div>
                      <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Left To Offset
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">
                          {overallEmmissions / 1000} TCO2
                        </dd>
                      </div>
                    </dl>
                  </div>
                ) : (
                  ""
                )}

                {/* show transactions table */}
                {transactions ? (
                  <div className="flex flex-col">
                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                      <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Hash
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Gas Used
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Nonce
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Transaction Status
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Offset Status
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {transactions.map((transaction, index) => (
                                <tr
                                  key={transaction.hash}
                                  className={
                                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                  }
                                >
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    <Link
                                      href={`https://mumbai.polygonscan.com/tx/${transaction.hash}`}
                                    >
                                      <a className="text-indigo-600 hover:text-indigo-900">
                                        {transaction.hash.substring(0, 15) +
                                          "..."}
                                      </a>
                                    </Link>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {transaction.gasUsed}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {transaction.nonce}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {transaction.transactionStatus}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {String(transaction.offsetStatus)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-96 flex justify-around items-center">
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={async () => {
                        await fetchTransactionsOfAddress(wallet);
                      }}
                    >
                      Load My Transactions
                    </button>
                  </div>
                )}
              </div>

              {/* /End replace */}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
