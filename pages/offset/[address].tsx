import { ethers } from "ethers";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import ifcPropsFromApp from "../../utils/ifcPropsFromApp";
import toastOptions from "../../utils/toastOptions";
import * as coAbi from "../../contract-utils/ContractOffsetter.json";
import AppNavbar from "../../components/AppNavbar";
import ConnectWalletAlert from "../../components/ConnectWalletAlert";
import { Loader } from "../../components/Loader";
import fetchAndFormatTransactions from "../../utils/fetchAndFormatTransactions";
import { ifcFormattedTransaction } from "../../utils/ifcTransaction";
import TransactionsTable from "../../components/TransactionsTable";
import { ContractOffsetter } from "../../contract-utils/ContractOffsetter";
import fetchOverallOffsetAmount from "../../utils/fetchOverallOffsetAmount";

// @ts-ignore some type props BS i don't have the time to look into right now
const Offset: NextPage = ({
  wallet,
  connectWallet,
  loading,
  setLoading,
  balances,
  getAndStoreBalances,
}: ifcPropsFromApp) => {
  const router = useRouter();
  const addressFromQuery =
    typeof router.query["address"] === "string" ||
    router.query["address"] instanceof String
      ? String(router.query["address"])
      : "";

  // these are stats for after you load transactions
  const [transactions, setTransactions] = useState<
    ifcFormattedTransaction[] | null
  >(null);
  const [overallGas, setOverallGas] = useState<number>(0);
  // emmissions in kg
  const [overallEmmissions, setOverallEmmissions] = useState<number>(0);
  // emmissions in tonnes
  const [emmissionsInTonnes, setEmmissionsInTonnes] = useState<string>("0");
  // overall footprint that user has offset up until now
  const [overallOffsetAmount, setOverallOffsetAmount] = useState<string>("0");

  // this is for the form
  const [token, setToken] = useState<string>("");

  const navigation = [
    { name: "Dashboard", href: "/dashboard", current: false },
    { name: "Offset", href: "/offset", current: false },
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
   */
  const getAndStoreTransactions = async (address: string) => {
    try {
      setLoading(true);
      const formattedTransactions = await fetchAndFormatTransactions(address);

      calculateOverallGas(formattedTransactions);
      calculateOverallFootprint(formattedTransactions);

      // fetch overallOffsetAmount
      const offsetAmount = await fetchOverallOffsetAmount(wallet);
      setOverallOffsetAmount(offsetAmount);

      setTransactions(formattedTransactions);
    } catch (error: any) {
      toast.error(error.message, toastOptions);
    } finally {
      setLoading(false);
    }
  };

  /**
   * calculates overall gas used and stores it in React state
   * @param transactions an array of unformatted transactions
   */
  const calculateOverallGas = (transactions: ifcFormattedTransaction[]) => {
    let overallGas: number = 0;
    transactions?.forEach((transaction) => {
      overallGas += parseInt(transaction.gasUsed);
    });
    setOverallGas(overallGas);
  };

  /**
   * calculates the overall footprint (based on transaction number) and stores it in React state
   * @param transactions an array of unformatted transactions
   */
  const calculateOverallFootprint = (
    transactions: ifcFormattedTransaction[]
  ) => {
    const notOffsetTransaction = transactions.filter(
      // filter out transactions that have been offset already
      (transaction) => !transaction.offsetStatus
    );

    // 0.00000036 TCO2 or 0.00036 kg per transaction
    // get the overall footprint in kg
    const overallFootprint: number = notOffsetTransaction?.length * 0.00036;
    // get overall footprint in tonnes
    const overallFootprintInTonnes = String(
      Math.round((overallFootprint / 1000) * 100000000) / 100000000
    ).substring(0, 10);

    // set overall footprint (for display) in kg
    setOverallEmmissions(overallFootprint);
    // set overall footprint in tonnes
    setEmmissionsInTonnes(overallFootprintInTonnes);
  };

  const handleOffset = async () => {
    try {
      if (!wallet) {
        throw new Error("Connect your wallet first.");
      }
      setLoading(true);

      // @ts-ignore
      const { ethereum } = window;
      if (!ethereum) {
        throw new Error("You need Metamask.");
      }

      if (!transactions) {
        throw new Error("No transactions were loaded.");
      }

      if (token == "") {
        throw new Error("You forgot to pick a new token.");
      }

      if (emmissionsInTonnes == "0") {
        throw new Error("You need to accumulate more CO2 to offfset.");
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

      const noncesBigNumberish = transactions
        .filter(
          // filter out transactions that have been offset already
          (transaction) => !transaction.offsetStatus
        )
        .map((transaction) => {
          return ethers.utils.parseEther(transaction.nonce);
        });

      const latestNotOffsetNonce = noncesBigNumberish[0];

      // offset the transactions
      const offsetTxn = await co.offset(
        token,
        ethers.utils.parseEther(emmissionsInTonnes),
        addressFromQuery,
        latestNotOffsetNonce
      );
      await offsetTxn.wait();
      console.log("offset hash", offsetTxn.hash);
      toast.success(
        `You've successfully offset all your footprint 🌳`,
        toastOptions
      );
    } catch (error: any) {
      console.error("error when offseting footprint", error);
      toast.error(error.message, toastOptions);
    } finally {
      setLoading(false);
      getAndStoreTransactions(addressFromQuery);
      getAndStoreBalances();
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
        <title>Offset - {addressFromQuery}</title>
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
                Offset
              </h1>
              <Link
                href={`https://mumbai.polygonscan.com/address/${addressFromQuery}`}
              >
                <a className="mt-1 text-sm text-pink-600 hover:text-pink-900">
                  {addressFromQuery}
                </a>
              </Link>
            </div>
            <div className="mt-4 flex flex-wrap md:mt-0 md:ml-4">
              {transactions ? (
                <div className="flex flex-wrap">
                  <select
                    onChange={(e) => {
                      setToken(e.target.value);
                    }}
                    id="token"
                    name="token"
                    autoComplete="token"
                    className="ml-3 inline-flex items-center shadow-sm focus:ring-pink-500 focus:border-pink-500 text-sm border-gray-300 rounded-md"
                  >
                    <option value="">
                      Pick a token to use when offsetting
                    </option>
                    {balances
                      ?.filter((token) => {
                        return (
                          // filter out tokens where user doesn't have a balance of in the ContractOffsetter
                          token.balance != "0.0" &&
                          // filter out BCT because you can only offset with TCO2
                          token.symbol != "BCT" &&
                          // filter out TCO2s where user hasn't deposited enough to cover overall footprint
                          Number(token.balance) / 1000 >
                            Number(emmissionsInTonnes)
                        );
                      })
                      .map((token) => {
                        return (
                          <option key={token.address} value={token.address}>
                            {token.symbol} (You have {token.balance} deposited)
                          </option>
                        );
                      })}
                  </select>
                  <button
                    onClick={() => {
                      handleOffset();
                    }}
                    type="button"
                    className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                  >
                    Offset All
                  </button>
                </div>
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
                    <dl className="grid grid-cols-1 gap-5 sm:grid-cols-4">
                      <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Overall Gas Used (All transactions)
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">
                          {Intl.NumberFormat("en-US").format(overallGas)}
                        </dd>
                      </div>
                      <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Your Historic Offsets (TCO2)
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">
                          ~ {overallOffsetAmount}
                        </dd>
                      </div>
                      <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          CO2 Left To Offset (kg)
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">
                          {overallEmmissions}
                        </dd>
                      </div>
                      <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Left To Offset (TCO2)
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">
                          ~ {emmissionsInTonnes}
                        </dd>
                      </div>
                    </dl>
                  </div>
                ) : (
                  ""
                )}

                {/* show transactions table */}
                {transactions ? (
                  <TransactionsTable transactions={transactions} />
                ) : (
                  <div className="h-96 flex justify-around items-center">
                    <button
                      onClick={async () => {
                        await getAndStoreTransactions(addressFromQuery);
                      }}
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                    >
                      Load Transactions of {addressFromQuery}
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

export default Offset;
