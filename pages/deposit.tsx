import { ethers } from "ethers";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AppNavbar from "../components/AppNavbar";
import { ContractOffsetter } from "../contract-utils/ContractOffsetter";
import * as coAbi from "../contract-utils/ContractOffsetter.json";
import * as bctAbi from "../contract-utils/BaseCarbonTonne.json";
import * as tco2Abi from "../contract-utils/ToucanCarbonOffsets.json";
import toastOptions from "../utils/toastOptions";
import { BaseCarbonTonne } from "../contract-utils/BaseCarbonTonne";
import { ToucanCarbonOffsets } from "../contract-utils/ToucanCarbonOffsets";
import { Loader } from "../components/Loader";
import ConnectWalletAlert from "../components/ConnectWalletAlert";
import Link from "next/link";

interface ifcDepositProps {
  wallet: string;
  connectWallet: Function;
  loading: boolean;
  setLoading: Function;
}

interface ifcTokenType {
  __typename: string;
  address: string;
  name: string;
  symbol: string;
}

interface ifcBalance {
  __typename: string;
  address: string;
  name: string;
  symbol: string;
  balance: string;
}

// @ts-ignore some type props BS i don't have the time to look into right now
const Deposit: NextPage = ({
  wallet,
  connectWallet,
  loading,
  setLoading,
}: ifcDepositProps) => {
  const navigation = [
    { name: "Dashboard", href: "/dashboard", current: false },
    { name: "Deposit", href: "/deposit", current: true },
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

  // these are for the form
  const [amount, setAmount] = useState<string>("1.0");
  const [token, setToken] = useState<string>(
    process.env.NEXT_PUBLIC_BCT_ADDRESS_MUMBAI || ""
  );

  // this is for stats
  const [balances, setBalances] = useState<ifcBalance[] | null>(null);

  const handleDeposit = async () => {
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

      // get portal to the token the user wants deposited (BCT or TCO2 for now)
      const tokenPortal = new ethers.Contract(
        token,
        token == process.env.NEXT_PUBLIC_BCT_ADDRESS_MUMBAI
          ? bctAbi.abi
          : tco2Abi.abi,
        signer
      );

      // token needs to approve ContractOffsetter first
      await (
        await tokenPortal.approve(co.address, ethers.utils.parseEther(amount))
      ).wait();

      // we then deposit the amount of TCO2/BCT into the ContractOffsetter
      const depositTxn = await co.deposit(
        token,
        ethers.utils.parseEther(amount),
        {
          gasLimit: 1200000,
        }
      );
      await depositTxn.wait();

      console.log("deposit hash", depositTxn.hash);

      toast(`You deposited ${amount} TCO2s`, toastOptions);
    } catch (error: any) {
      console.error("error when depositing", error);
      toast.error(error.message, toastOptions);
    } finally {
      setLoading(false);
      fetchBalances();
    }
  };

  const fetchDepositableTokenTypes = async () => {
    const response = await fetch(`/api/getAllTCO2Types`);
    const data: any = await response.json();

    // preparing tokens to check/display in an easily formattable way
    const tokensToCheck = [
      ...data,
      {
        __typename: "BaseCarbonTonne",
        address: process.env.NEXT_PUBLIC_BCT_ADDRESS_MUMBAI,
        name: "Toucan Protocol: Base Carbon Tonne",
        symbol: "BCT",
      },
    ];
    return tokensToCheck;
  };

  const fetchBalances = async () => {
    try {
      if (!wallet) {
        throw new Error("Connect your wallet first.");
      }
      setLoading(true);

      const DepositableTokenTypes: ifcTokenType[] =
        await fetchDepositableTokenTypes();

      if (!DepositableTokenTypes) {
        throw new Error("No token types available.");
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

      const balances = await Promise.all(
        DepositableTokenTypes.map(async (tokenType) => {
          const balance = ethers.utils.formatEther(
            await co.balances(wallet, tokenType.address)
          );
          return { ...tokenType, balance };
        })
      );
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

  useEffect(() => {
    fetchBalances();
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
        <title>Deposit</title>
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
                Deposit
              </h1>
            </div>
          </header>
          <main>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Replace with your content */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleDeposit();
                }}
                className="space-y-8 divide-y divide-gray-200"
              >
                <div className="space-y-8 divide-y divide-gray-200">
                  <div className="pt-8">
                    <div>
                      <p className="mt-1 text-sm text-gray-500">
                        Choose what you want to deposit and how much.
                      </p>
                    </div>
                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      {/* say amount to deposit */}
                      <div className="sm:col-span-4">
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Amount to deposit
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

                      {/* select coin to deposit */}
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="country"
                          className="block text-sm font-medium text-gray-700"
                        >
                          What do you want to deposit?
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
                            {balances?.map((token) => {
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
              {balances ? (
                <>
                  <h2 className="text-2xl font-bold leading-tight text-gray-900">
                    Balances
                  </h2>
                  <div className="mt-5 flex flex-col">
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
                                  Address
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Symbol
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Name
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Balance
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {balances
                                .filter((token) => token.balance != "0.0")
                                .map((token, index) => (
                                  <tr
                                    key={token.address}
                                    className={
                                      index % 2 === 0
                                        ? "bg-white"
                                        : "bg-gray-50"
                                    }
                                  >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                      <Link
                                        href={`https://mumbai.polygonscan.com/address/${token.address}`}
                                      >
                                        <a className="text-indigo-600 hover:text-indigo-900">
                                          {token.address.substring(0, 15) +
                                            "..."}
                                        </a>
                                      </Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {token.symbol}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {token.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {token.balance}
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                ""
              )}
              {/* /End replace */}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Deposit;
