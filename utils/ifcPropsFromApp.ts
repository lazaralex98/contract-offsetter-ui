import ifcBalance from "./ifcBalance";

interface ifcPropsFromApp {
  wallet: string;
  connectWallet: Function;
  disconnectWallet: Function;
  loading: boolean;
  setLoading: Function;
  balances: ifcBalance[];
  getAndStoreBalances: Function;
}

export default ifcPropsFromApp;
