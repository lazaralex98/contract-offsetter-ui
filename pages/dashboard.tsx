import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { Fragment, useEffect } from "react";
import { Popover, Transition } from "@headlessui/react";
import { MenuIcon, XCircleIcon, XIcon } from "@heroicons/react/outline";
import Link from "next/link";
import { useRouter } from "next/router";

const navigation = [
  {
    name: "Contract Offseter Repo",
    href: "https://github.com/lazaralex98/eco-1",
  },
  {
    name: "Contract Offseter Polygonscan",
    href: "https://mumbai.polygonscan.com/address/0x4f78BE049AB771Be0A9095B4d9DeB8bdeff9Ba03",
  },
];

interface ifcDashboardProps {
  wallet: string;
  connectWallet: Function;
  loading: boolean;
}

// @ts-ignore some type props BS i don't have the time to look into right now
const Dashboard: NextPage = ({
  wallet,
  connectWallet,
  loading,
}: ifcDashboardProps) => {
  if (loading) {
    return <p>Loading...</p>;
  }

  if (!wallet) {
    const router = useRouter();

    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0"></div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              You need to connect your wallet to access this page. Go back home
              to do that.
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
                <button
                  onClick={() => {
                    router.push("/");
                  }}
                  type="button"
                  className="ml-2 bg-red-200 px-2 py-1.5 rounded-md text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-grereden-50 focus:ring-red-600"
                >
                  Go back home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>Dashboard</title>
      </Head>

      <div className="relative bg-gray-50 overflow-hidden">
        <div className="relative pt-6 pb-16 sm:pb-24">
          <Popover>
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <nav
                className="relative flex items-center justify-between sm:h-10 md:justify-center"
                aria-label="Global"
              >
                <div className="flex items-center flex-1 md:absolute md:inset-y-0 md:left-0">
                  <div className="flex items-center justify-between w-full md:w-auto">
                    <Link href="https://toucan.earth">
                      <a>
                        <span className="sr-only">Toucan</span>
                        <Image
                          src="/toucan-logo.svg"
                          width={128}
                          height={128}
                          className="h-8 w-auto sm:h-10"
                          alt="Toucan Logo"
                        />
                      </a>
                    </Link>
                    <div className="-mr-2 flex items-center md:hidden">
                      <Popover.Button className="bg-gray-50 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                        <span className="sr-only">Open main menu</span>
                        <MenuIcon className="h-6 w-6" aria-hidden="true" />
                      </Popover.Button>
                    </div>
                  </div>
                </div>
                <div className="hidden md:flex md:space-x-10">
                  {navigation.map((item) => (
                    <Link href={item.href} key={item.name}>
                      <a className="font-medium text-gray-500 hover:text-gray-900">
                        {item.name}
                      </a>
                    </Link>
                  ))}
                </div>
                <div className="hidden md:absolute md:flex md:items-center md:justify-end md:inset-y-0 md:right-0">
                  <span className="inline-flex rounded-md shadow">
                    <button
                      onClick={() => {
                        console.log("hei");
                      }}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50"
                    >
                      Connect wallet
                    </button>
                  </span>
                </div>
              </nav>
            </div>

            <Transition
              as={Fragment}
              enter="duration-150 ease-out"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="duration-100 ease-in"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Popover.Panel
                focus
                className="absolute z-10 top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden"
              >
                <div className="rounded-lg shadow-md bg-white ring-1 ring-black ring-opacity-5 overflow-hidden">
                  <div className="px-5 pt-4 flex items-center justify-between">
                    <div>
                      <Image
                        src="/toucan-logo.svg"
                        width={32}
                        height={32}
                        className="h-8 w-auto"
                      />
                    </div>
                    <div className="-mr-2">
                      <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                        <span className="sr-only">Close menu</span>
                        <XIcon className="h-6 w-6" aria-hidden="true" />
                      </Popover.Button>
                    </div>
                  </div>
                  <div className="px-2 pt-2 pb-3">
                    {navigation.map((item) => (
                      <Link key={item.name} href={item.href}>
                        <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                          {item.name}
                        </a>
                      </Link>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      console.log("hei");
                    }}
                    className="block w-full px-5 py-3 text-center font-medium text-indigo-600 bg-gray-50 hover:bg-gray-100"
                  >
                    Connect wallet
                  </button>
                </div>
              </Popover.Panel>
            </Transition>
          </Popover>

          <main className="mt-16 mx-auto max-w-7xl px-4 sm:mt-24">
            <div className="text-center">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Easily </span>
                <span className="block text-indigo-600 xl:inline">
                  DASHBOARD
                </span>{" "}
                of your contracts
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                This is a dapp that makes it easy for you to see the emmissions
                generated by you or contracts of your choice and to offset the
                footprint you/they have created.
              </p>
              <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                <div className="rounded-md shadow">
                  <button
                    onClick={() => {
                      console.log("hei");
                    }}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                  >
                    Connect wallet
                  </button>
                </div>
                <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                  <Link href="#learn-more">
                    <a className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                      Learn more
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
