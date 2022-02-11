import type { NextPage } from "next";
import Head from "next/head";
import AppNavbar from "../components/AppNavbar";
import { Loader } from "../components/Loader";

interface ifcHelpProps {
  wallet: string;
  connectWallet: Function;
  loading: boolean;
}

// @ts-ignore some type props BS i don't have the time to look into right now
const Help: NextPage = ({ wallet, connectWallet, loading }: ifcHelpProps) => {
  if (loading) {
    return <Loader />;
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
