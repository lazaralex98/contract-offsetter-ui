import "../styles/globals.css";
import type { AppProps } from "next/app";
import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import toastOptions from "../utils/toastOptions";
import "react-toastify/dist/ReactToastify.css";
import fetchBalances from "../utils/fetchBalances";
import fetchDepositableTokenTypes from "../utils/fetchDepositableTokenTypes";
import ifcBalance from "../utils/ifcBalance";
import Router from "next/router";

function MyApp({ Component, pageProps }: AppProps) {
  const [wallet, setWallet] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [balances, setBalances] = useState<ifcBalance[] | null>(null);

  const connectWallet = async () => {
    try {
      setLoading(true);

      // @ts-ignore
      const { ethereum } = window;
      if (!ethereum) {
        throw new Error("You need Metamask.");
      }

      const provider = new ethers.providers.Web3Provider(ethereum);
      const { chainId } = await provider.getNetwork();
      if (chainId != 80001) {
        throw new Error("Make sure you are on Mumbai Test Network.");
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      // TODO issue accounts lowercases the address
      console.log("accounts", accounts);
      setWallet(accounts[0]);
    } catch (error: any) {
      console.error("error when connecting wallet", error);
      toast.error(error.message, toastOptions);
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setWallet(null);
  };

  const getAndStoreBalances = async () => {
    try {
      if (!wallet) {
        throw new Error("Connect your wallet first.");
      }
      console.log(`getAndStoreBalances at: ${Router.asPath}`);
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
    if (wallet) {
      getAndStoreBalances();
    }
  }, [wallet]);

  return (
    <>
      <Component
        wallet={wallet}
        connectWallet={connectWallet}
        disconnectWallet={disconnectWallet}
        loading={loading}
        setLoading={setLoading}
        balances={balances}
        getAndStoreBalances={getAndStoreBalances}
        {...pageProps}
      />
      <ToastContainer />
    </>
  );
}

export default MyApp;
