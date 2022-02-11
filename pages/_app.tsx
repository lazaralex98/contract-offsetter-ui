import "../styles/globals.css";
import type { AppProps } from "next/app";
import { toast, ToastContainer } from "react-toastify";
import { useState } from "react";
import { ethers } from "ethers";
import toastOptions from "../utils/toastOptions";
import "react-toastify/dist/ReactToastify.css";

function MyApp({ Component, pageProps }: AppProps) {
  const [wallet, setWallet] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

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

  return (
    <>
      <Component
        wallet={wallet}
        connectWallet={connectWallet}
        loading={loading}
        disconnectWallet={disconnectWallet}
        setLoading={setLoading}
        {...pageProps}
      />
      <ToastContainer />
    </>
  );
}

export default MyApp;
