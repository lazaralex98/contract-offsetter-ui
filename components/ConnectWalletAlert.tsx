const ConnectWalletAlert = ({ connectWallet }: { connectWallet: Function }) => {
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
};

export default ConnectWalletAlert;
