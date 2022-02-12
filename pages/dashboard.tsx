import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AppNavbar from "../components/AppNavbar";
import { Loader } from "../components/Loader";
import toastOptions from "../utils/toastOptions";

interface ifcDashboardProps {
  wallet: string;
  connectWallet: Function;
  loading: boolean;
  setLoading: Function;
}

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

// @ts-ignore some type props BS i don't have the time to look into right now
const Dashboard: NextPage = ({
  wallet,
  connectWallet,
  loading,
  setLoading,
}: ifcDashboardProps) => {
  const [transactions, setTransactions] = useState<ifcTransaction[] | null>(
    null
  );

  if (loading) {
    return <Loader />;
  }

  if (!wallet) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0"></div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              You need to connect your wallet to access this page.
            </h3>
            <div className="mt-4">
              <div className="flex">
                <button
                  onClick={() => {
                    connectWallet();
                  }}
                  type="button"
                  className="bg-red-200 px-2 py-1.5 rounded-md text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-grereden-50 focus:ring-red-600"
                >
                  Connect wallet
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const navigation = [
    { name: "Offset", href: "/dashboard", current: true },
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

  // fetches and array of arrays of transactions for the address
  // Note : This API endpoint returns a maximum of 10,000 records only.
  const getTransactionsOfAddress = async (address: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/getTransactionsOfAddress?address=${address}`
      );
      const data: any = await response.json();
      if (data.message != "OK") throw new Error(data.message);

      setTransactions(data.data.result);
    } catch (error: any) {
      toast.error(error.message, toastOptions);
    } finally {
      setLoading(false);
    }
  };

  // TODO prepare transactions such that you have: overall_emmissions and offset_status (for each transaction)

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
          <header>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold leading-tight text-gray-900">
                Dashboard
              </h1>
            </div>
          </header>
          <main>
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
              {/* Replace with your content */}
              <div className="px-4 py-8 sm:px-0">
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
                                  Status
                                </th>
                                <th scope="col" className="relative px-6 py-3">
                                  <span className="sr-only">Edit</span>
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
                                    {transaction.txreceipt_status}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <a
                                      href="#"
                                      className="text-indigo-600 hover:text-indigo-900"
                                    >
                                      Edit
                                    </a>
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
                      onClick={() => {
                        getTransactionsOfAddress(wallet);
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
