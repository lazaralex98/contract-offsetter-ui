import { ethers } from "ethers";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AppNavbar from "../components/AppNavbar";
import BalancesTable from "../components/BalancesTable";
import ConnectWalletAlert from "../components/ConnectWalletAlert";
import { Loader } from "../components/Loader";
import fetchBalances from "../utils/fetchBalances";
import fetchDepositableTokenTypes from "../utils/fetchDepositableTokenTypes";
import ifcBalance from "../utils/ifcBalance";
import toastOptions from "../utils/toastOptions";
import * as coAbi from "../contract-utils/ContractOffsetter.json";
import * as bctAbi from "../contract-utils/BaseCarbonTonne.json";
import * as tco2Abi from "../contract-utils/ToucanCarbonOffsets.json";
import ifcPropsFromApp from "../utils/ifcPropsFromApp";

// TODO make page
// @ts-ignore some type props BS i don't have the time to look into right now
const Redeem: NextPage = ({
  wallet,
  connectWallet,
  loading,
  setLoading,
}: ifcPropsFromApp) => {
  const navigation = [
    { name: "Dashboard", href: "/dashboard", current: false },
    { name: "Deposit", href: "/deposit", current: false },
    { name: "Redeem", href: "/redeem", current: true },
    { name: "Help", href: "/help", current: false },
  ];
  const userNavigation = [
    {
      name: "Your wallet",
      href: `https://mumbai.polygonscan.com/address/${wallet}`,
    },
    { name: "Disconnect", href: "/disconnect" },
  ];

  // these are for the form
  const [amount, setAmount] = useState<string>("1.0");
  const [token, setToken] = useState<string>("");

  // this is for stats
  const [balances, setBalances] = useState<ifcBalance[] | null>(null);

  // TODO it would make sense to have the balances fetched and stored in _app instead of each individual page that needs it
  const storeBalances = async () => {
    try {
      if (!wallet) {
        throw new Error("Connect your wallet first.");
      }
      setLoading(true);

      const DepositableTokenTypes = await fetchDepositableTokenTypes();

      if (!DepositableTokenTypes) {
        throw new Error("No token types available.");
      }

      const balances = await fetchBalances(DepositableTokenTypes, wallet);

      // sort and store balances in state
      setBalances(
        balances.sort((a, b) => {
          if (a.symbol < b.symbol) {
            return -1;
          }
          if (a.symbol > b.symbol) {
            return 1;
          }
          return 0;
        })
      );
    } catch (error: any) {
      console.error("error when fetching balances", error);
      toast.error(error.message, toastOptions);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeemal = async () => {
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

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();

      // get portal to ContractOffsetter
      // @ts-ignore
      const co: ContractOffsetter = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_OFFSETTER_ADDRESS_MUMBAI || "",
        coAbi.abi,
        signer
      );

      // we then deposit the amount of TCO2/BCT into the ContractOffsetter
      const redeemalTxn = await co.redeemBCT(
        token,
        ethers.utils.parseEther(amount),
        {
          gasLimit: 1200000,
        }
      );
      await redeemalTxn.wait();

      console.log("redeemal hash", redeemalTxn.hash);

      toast(`You redeemed ${amount} BCT for TCO2s`, toastOptions);
    } catch (error: any) {
      console.error("error when depositing", error);
      toast.error(error.message, toastOptions);
    } finally {
      setLoading(false);
      storeBalances();
    }
  };

  useEffect(() => {
    storeBalances();
  }, [wallet]);

  if (loading) {
    return <Loader />;
  }

  if (!wallet) {
    return <ConnectWalletAlert connectWallet={connectWallet} />;
  }

  return (
    <>
      <Head>
        <title>Redeem</title>
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
                Redeem
              </h1>
            </div>
          </header>
          <main>
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
              {/* Replace with your content */}
              <div className="px-4 py-8 sm:px-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleRedeemal();
                  }}
                  className="space-y-8 divide-y divide-gray-200"
                >
                  <div className="space-y-8 divide-y divide-gray-200">
                    <div className="pt-8">
                      <div>
                        <p className="mt-1 text-sm text-gray-500">
                          Choose what TCO2 you want to redeem your BCT for and
                          how much of it you want redeemed.
                        </p>
                      </div>
                      <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        {/* say amount to deposit */}
                        <div className="sm:col-span-4">
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Amount to redeem
                          </label>
                          <div className="mt-1">
                            <input
                              onChange={(e) => {
                                setAmount(e.target.value);
                              }}
                              value={amount}
                              id="amount"
                              name="amount"
                              type="text"
                              autoComplete="amount"
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>

                        {/* select coin to receive */}
                        <div className="sm:col-span-3">
                          <label
                            htmlFor="country"
                            className="block text-sm font-medium text-gray-700"
                          >
                            What do you want to get?
                          </label>
                          <div className="mt-1">
                            <select
                              onChange={(e) => {
                                setToken(e.target.value);
                              }}
                              id="token"
                              name="token"
                              autoComplete="token"
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            >
                              <option value="">Pick a token to redeem</option>
                              {balances
                                ?.filter((token) => {
                                  if (token.symbol != "BCT") {
                                    return token;
                                  }
                                })
                                .map((token) => {
                                  return (
                                    <option value={token.address}>
                                      {token.symbol}
                                    </option>
                                  );
                                })}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-5">
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Deposit
                      </button>
                    </div>
                  </div>
                </form>
                {balances ? <BalancesTable balances={balances} /> : ""}
              </div>
              {/* /End replace */}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Redeem;
