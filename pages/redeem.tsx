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
import { BaseCarbonTonne } from "../contract-utils/BaseCarbonTonne";

// @ts-ignore some type props BS i don't have the time to look into right now
const Redeem: NextPage = ({
  wallet,
  connectWallet,
  loading,
  setLoading,
  balances,
  getAndStoreBalances,
}: ifcPropsFromApp) => {
  const navigation = [
    { name: "Dashboard", href: "/dashboard", current: false },
    { name: "Offset", href: "/offset", current: false },
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
  const [tokensThatBCTPoolhas, setTokensThatBCTPoolhas] = useState<
    ifcBalance[] | null
  >(null);

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

      // we then redeem the amount of BCT for the desired TCO2 using the ContractOffsetter
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
      console.error("error when redeeming", error);
      toast.error(error.message, toastOptions);
    } finally {
      setLoading(false);
      getAndStoreBalances();
    }
  };

  const filterBalancesThatBCTPoolDoesntHave = async () => {
    try {
      // fetch balances of BCT pool
      if (!wallet) {
        throw new Error("Connect your wallet first.");
      }
      setLoading(true);

      if (!balances) {
        throw new Error("No balances were found to filter.");
      }

      const filteredBalances: ifcBalance[] = balances.filter(
        (token: ifcBalance) => {
          return ethers.utils
            .parseEther(token.bctPoolBalance)
            .gt(ethers.utils.parseEther("0.0"));
        }
      );

      setTokensThatBCTPoolhas(filteredBalances || null);
    } catch (error: any) {
      console.error("error when filtering balances", error);
      toast.error(error.message, toastOptions);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (wallet && balances) {
      filterBalancesThatBCTPoolDoesntHave();
    }
  }, [balances]);

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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Replace with your content */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRedeemal();
                }}
                className="space-y-8 divide-y divide-gray-200"
              >
                <div className="space-y-8 divide-y divide-gray-200">
                  <div>
                    <div>
                      <p className="mt-1 text-sm text-gray-500">
                        Choose what TCO2 you want to redeem your BCT for and how
                        much of it you want redeemed.
                      </p>
                    </div>
                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      {/* say amount to redeem */}
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
                            className="shadow-sm focus:ring-pink-500 focus:border-pink-500 block w-full sm:text-sm border-gray-300 rounded-md"
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
                            className="shadow-sm focus:ring-pink-500 focus:border-pink-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          >
                            <option value="">Pick a token to redeem for</option>
                            {tokensThatBCTPoolhas
                              ?.filter((token) => {
                                // filter BCT out
                                if (token.symbol != "BCT") {
                                  return token;
                                }
                              })
                              .map((token) => {
                                return (
                                  <option
                                    key={token.symbol}
                                    value={token.address}
                                  >
                                    {token.symbol} (Can redeem max{" "}
                                    {token.bctPoolBalance})
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
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                    >
                      Redeem
                    </button>
                  </div>
                </div>
              </form>
              {balances ? <BalancesTable balances={balances} /> : ""}
              {/* /End replace */}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Redeem;
