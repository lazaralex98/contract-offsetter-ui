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

interface ifcRedeemProps {
  wallet: string;
  connectWallet: Function;
  loading: boolean;
  setLoading: Function;
}
// TODO make page
// @ts-ignore some type props BS i don't have the time to look into right now
const Redeem: NextPage = ({
  wallet,
  connectWallet,
  loading,
  setLoading,
}: ifcRedeemProps) => {
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

  // this is for stats
  const [balances, setBalances] = useState<ifcBalance[] | null>(null);

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
                <div className="border-4 border-dashed border-gray-200 rounded-lg h-96" />
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
