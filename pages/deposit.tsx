import { ethers } from "ethers";
import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { toast } from "react-toastify";
import AppNavbar from "../components/AppNavbar";
import { ContractOffsetter } from "../contract-utils/ContractOffsetter";
import * as coAbi from "../contract-utils/ContractOffsetter.json";
import * as bctAbi from "../contract-utils/BaseCarbonTonne.json";
import * as tco2Abi from "../contract-utils/ToucanCarbonOffsets.json";
import toastOptions from "../utils/toastOptions";
import { BaseCarbonTonne } from "../contract-utils/BaseCarbonTonne";
import { ToucanCarbonOffsets } from "../contract-utils/ToucanCarbonOffsets";

interface ifcDepositProps {
  wallet: string;
  connectWallet: Function;
  loading: boolean;
  setLoading: Function;
}

// @ts-ignore some type props BS i don't have the time to look into right now
const Deposit: NextPage = ({
  wallet,
  connectWallet,
  loading,
  setLoading,
}: ifcDepositProps) => {
  if (loading) {
    return <p>Loading...</p>;
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
    { name: "Offset", href: "/dashboard", current: false },
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

  const [amount, setAmount] = useState<string>("1.0");
  const [token, setToken] = useState<string>("BCT");
  const [TCO2Address, setTCO2Address] = useState<string>("");

  const handleDeposit = async () => {
    try {
      if (!wallet) {
        throw new Error("Connect your wallet first.");
      }
      setLoading(true);

      if (token == "TCO2" && TCO2Address == "") {
        throw new Error(
          "To deposit a TCO2, you need to mention the address of the TCO2 you want deposited."
        );
      }

      // @ts-ignore
      const { ethereum } = window;
      if (!ethereum) {
        throw new Error("You need Metamask.");
      }

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();

      // get portal to the token the user wants deposited (BCT or TCO2 for now)
      let tokenPortal;
      if (token == "TCO2") {
        tokenPortal = new ethers.Contract(TCO2Address, tco2Abi.abi, signer);
      } else {
        tokenPortal = new ethers.Contract(
          process.env.NEXT_PUBLIC_BCT_ADDRESS_MUMBAI || "",
          bctAbi.abi,
          signer
        );
      }

      // get portal to ContractOffsetter
      const co = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_OFFSETTER_ADDRESS_MUMBAI || "",
        coAbi.abi,
        signer
      );

      // token needs to approve ContractOffsetter first
      await (
        await tokenPortal.approve(co.address, ethers.utils.parseEther(amount))
      ).wait();

      // we then deposit the amount of TCO2/BCT into the ContractOffsetter
      const depositTxn = await co.deposit(
        TCO2Address,
        ethers.utils.parseEther(amount),
        {
          gasLimit: 1200000,
        }
      );
      await depositTxn.wait();

      console.log("deposit hash", depositTxn.hash);

      toast(`You deposited ${amount} TCO2s`, toastOptions);
    } catch (error: any) {
      console.error("error when depositing TCO2", error);
      toast.error(error.message, toastOptions);
    } finally {
      setLoading(false);
    }
  };

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
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
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
                            <option value="BCT">BCT</option>
                            <option value="TCO2">TCO2</option>
                          </select>
                        </div>
                      </div>

                      {/* if TCO2, say address of TCO2 you want to deposit */}
                      {token == "BCT" ? (
                        ""
                      ) : (
                        <div className="sm:col-span-4">
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                          >
                            TCO2 address
                          </label>
                          <div className="mt-1">
                            <input
                              onChange={(e) => {
                                setTCO2Address(e.target.value);
                              }}
                              value={TCO2Address}
                              id="tco2Address"
                              name="tco2Address"
                              type="text"
                              autoComplete="tco2Address"
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                      )}
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
              {/* /End replace */}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Deposit;
