import type { NextPage } from "next";
import Head from "next/head";
import AppNavbar from "../components/AppNavbar";
import ConnectWalletAlert from "../components/ConnectWalletAlert";
import { Loader } from "../components/Loader";
import ifcPropsFromApp from "../utils/ifcPropsFromApp";

// TODO make page
// @ts-ignore some type props BS i don't have the time to look into right now
const Help: NextPage = ({
  wallet,
  connectWallet,
  loading,
}: ifcPropsFromApp) => {
  const navigation = [
    { name: "Dashboard", href: "/dashboard", current: false },
    { name: "Deposit", href: "/deposit", current: false },
    { name: "Redeem", href: "/redeem", current: false },
    { name: "Help", href: "/help", current: true },
  ];
  const userNavigation = [
    {
      name: "Your wallet",
      href: `https://mumbai.polygonscan.com/address/${wallet}`,
    },
    { name: "Disconnect", href: "/disconnect" },
  ];

  if (loading) {
    return <Loader />;
  }

  if (!wallet) {
    return <ConnectWalletAlert connectWallet={connectWallet} />;
  }

  // TODO when you're done with the dapp, make content explaining how to use it

  return (
    <>
      <Head>
        <title>Help</title>
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
                Help
              </h1>
            </div>
          </header>
          <main>
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
              {/* Replace with your content */}
              <div className="px-4 py-8 sm:px-0">
                <div className="border-4 border-dashed border-gray-200 rounded-lg h-96" />
              </div>
              {/* /End replace */}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Help;
