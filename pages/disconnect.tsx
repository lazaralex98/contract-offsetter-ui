import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

interface ifcDisconnectProps {
  disconnectWallet: Function;
}

// @ts-ignore some type props BS i don't have the time to look into right now
const Disconnect: NextPage = ({ disconnectWallet }: ifcDisconnectProps) => {
  disconnectWallet();

  return (
    <div className="rounded-md bg-blue-50 p-4">
      <Head>
        <title>Disconnect</title>
      </Head>
      <div className="flex">
        <div className="flex-shrink-0"></div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-blue-800">
            You need to connect your wallet to access this page.
          </h3>
          <div className="mt-4">
            <div className="flex">
              <Link href="/">
                <a
                  type="button"
                  className="bg-blue-200 px-2 py-1.5 rounded-md text-sm font-medium text-blue-800 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-greblueen-50 focus:ring-blue-600"
                >
                  Go home
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Disconnect;
