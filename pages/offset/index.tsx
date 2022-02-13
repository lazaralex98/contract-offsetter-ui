import { ethers } from "ethers";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import ifcPropsFromApp from "../../utils/ifcPropsFromApp";
import { Loader } from "../../components/Loader";
import ConnectWalletAlert from "../../components/ConnectWalletAlert";
import AppNavbar from "../../components/AppNavbar";
import { useRouter } from "next/router";

// @ts-ignore some type props BS i don't have the time to look into right now
const Offset: NextPage = ({
  wallet,
  connectWallet,
  loading,
  setLoading,
  balances,
  getAndStoreBalances,
}: ifcPropsFromApp) => {
  const navigation = [
    { name: "Dashboard", href: "/dashboard", current: false },
    { name: "Offset", href: "/offset", current: true },
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

  // these are for the form
  const [address, setAddress] = useState<string>(wallet);

  if (loading) {
    return <Loader />;
  }

  if (!wallet) {
    return <ConnectWalletAlert connectWallet={connectWallet} />;
  }

  return (
    <>
      <Head>
        <title>Offset</title>
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
                Want to offset another contract?
              </h1>
            </div>
          </header>
          <main>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Replace with your content */}
              <div className="space-y-8 divide-y divide-gray-200">
                <div className="space-y-8 divide-y divide-gray-200">
                  <div>
                    <div>
                      <p className="mt-1 text-sm text-gray-500">
                        Choose what contract you want to offset.
                      </p>
                    </div>
                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      {/* say address to see */}
                      <div className="sm:col-span-4">
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Address
                        </label>
                        <div className="mt-1">
                          <input
                            onChange={(e) => {
                              setAddress(e.target.value);
                            }}
                            value={address}
                            id="contractAddress"
                            name="contractAddress"
                            type="text"
                            autoComplete="contractAddress"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-5">
                  <div className="flex justify-end">
                    <Link href={`/offset/${address}`}>
                      <a
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Go to offset panel for chosen contract
                      </a>
                    </Link>
                  </div>
                </div>
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
