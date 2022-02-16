import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import AppNavbar from "../components/AppNavbar";
import ConnectWalletAlert from "../components/ConnectWalletAlert";
import { Loader } from "../components/Loader";
import YouTubeEmbed from "../components/YouTubeEmbed";
import ifcPropsFromApp from "../utils/ifcPropsFromApp";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

// @ts-ignore some type props BS i don't have the time to look into right now
const Help: NextPage = ({
  wallet,
  connectWallet,
  loading,
}: ifcPropsFromApp) => {
  const navigation = [
    { name: "Dashboard", href: "/dashboard", current: false },
    { name: "Offset", href: "/offset", current: false },
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
          <main>
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
              {/* Replace with your content */}
              <div className="px-4 py-8 sm:px-0  divide-y-2 divide-gray-200">
                <h2 className="text-center text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  Help
                </h2>
                <dl className="mt-6 space-y-6 divide-y divide-gray-200">
                  <Disclosure as="div" className="pt-6">
                    {({ open }) => (
                      <>
                        <dt className="text-lg">
                          <Disclosure.Button className="text-left w-full flex justify-between items-start text-gray-400">
                            <span className="font-medium text-gray-900">
                              Can I see a demo?
                            </span>
                            <span className="ml-6 h-7 flex items-center">
                              <ChevronDownIcon
                                className={classNames(
                                  open ? "-rotate-180" : "rotate-0",
                                  "h-6 w-6 transform"
                                )}
                                aria-hidden="true"
                              />
                            </span>
                          </Disclosure.Button>
                        </dt>
                        <Disclosure.Panel as="dd" className="mt-2 pr-12">
                          <p className="text-base text-gray-500">
                            Of course, I have made a walkthrough + explanation
                            of how to use the app right here:
                          </p>
                          <YouTubeEmbed embedId="LADN-Vt8Khw" />
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                </dl>
                <dl className="mt-6 space-y-6 divide-y divide-gray-200">
                  <Disclosure as="div" className="pt-6">
                    {({ open }) => (
                      <>
                        <dt className="text-lg">
                          <Disclosure.Button className="text-left w-full flex justify-between items-start text-gray-400">
                            <span className="font-medium text-gray-900">
                              Can I see the repo / documentation of how all this
                              works?
                            </span>
                            <span className="ml-6 h-7 flex items-center">
                              <ChevronDownIcon
                                className={classNames(
                                  open ? "-rotate-180" : "rotate-0",
                                  "h-6 w-6 transform"
                                )}
                                aria-hidden="true"
                              />
                            </span>
                          </Disclosure.Button>
                        </dt>
                        <Disclosure.Panel as="dd" className="mt-2 pr-12">
                          <p className="text-base text-gray-500">
                            Yes! Here is a{" "}
                            <Link href="https://github.com/lazaralex98/eco-1">
                              <a className="text-pink-600 hover:text-pink-900">
                                link to the repo of the contract
                              </a>
                            </Link>{" "}
                            and here a{" "}
                            <Link href="https://github.com/lazaralex98/contract-offsetter-ui">
                              <a className="text-pink-600 hover:text-pink-900">
                                link to the repo of this dapp
                              </a>
                            </Link>
                            . Both repos have READMEs explaining how it all
                            works.
                          </p>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                </dl>
                <dl className="mt-6 space-y-6 divide-y divide-gray-200">
                  <Disclosure as="div" className="pt-6">
                    {({ open }) => (
                      <>
                        <dt className="text-lg">
                          <Disclosure.Button className="text-left w-full flex justify-between items-start text-gray-400">
                            <span className="font-medium text-gray-900">
                              Can I see the contract&lsquo;s Polygonscan?
                            </span>
                            <span className="ml-6 h-7 flex items-center">
                              <ChevronDownIcon
                                className={classNames(
                                  open ? "-rotate-180" : "rotate-0",
                                  "h-6 w-6 transform"
                                )}
                                aria-hidden="true"
                              />
                            </span>
                          </Disclosure.Button>
                        </dt>
                        <Disclosure.Panel as="dd" className="mt-2 pr-12">
                          <p className="text-base text-gray-500">
                            Here you go:{" "}
                            <Link
                              href={
                                process.env
                                  .NEXT_PUBLIC_CONTRACT_OFFSETTER_ADDRESS_MUMBAI ||
                                ""
                              }
                            >
                              <a className="text-pink-600 hover:text-pink-900">
                                {
                                  process.env
                                    .NEXT_PUBLIC_CONTRACT_OFFSETTER_ADDRESS_MUMBAI
                                }
                              </a>
                            </Link>
                          </p>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                </dl>
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
