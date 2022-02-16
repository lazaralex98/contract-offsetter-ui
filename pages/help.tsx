import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import AppNavbar from "../components/AppNavbar";
import ConnectWalletAlert from "../components/ConnectWalletAlert";
import { Loader } from "../components/Loader";
import ifcPropsFromApp from "../utils/ifcPropsFromApp";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

// TODO write these
const faqs = [
  {
    question: "What's the expected flow I should go through?",
    answer:
      "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
    image: "",
  },
  {
    question: "How do I deposit?",
    answer: "lorem ipsum",
    image: "",
  },
  {
    question: "How do I redeem?",
    answer: "lorem ipsum",
    image: "",
  },
  {
    question: "How do I offset?",
    answer: "lorem ipsum",
    image: "",
  },
  {
    question: "How do I offset other contracts?",
    answer: "lorem ipsum",
    image: "",
  },
];

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
                  {faqs.map((faq) => (
                    <Disclosure as="div" key={faq.question} className="pt-6">
                      {({ open }) => (
                        <>
                          <dt className="text-lg">
                            <Disclosure.Button className="text-left w-full flex justify-between items-start text-gray-400">
                              <span className="font-medium text-gray-900">
                                {faq.question}
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
                              {faq.answer}
                            </p>
                            {faq.image && faq.image != "" ? (
                              <Image src={faq.image} width={600} height={400} />
                            ) : (
                              ""
                            )}
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  ))}
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
