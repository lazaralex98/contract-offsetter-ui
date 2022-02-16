import Link from "next/link";
import ifcBalance from "../utils/ifcBalance";

const BalancesTable = ({ balances }: { balances: ifcBalance[] }) => {
  return (
    <div className="mt-3">
      <h2 className="text-2xl font-bold leading-tight text-gray-900">
        Balances
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        This represents the tokens you have deposited or otherwise own within
        this dapp (specifically the ContractOffsetter contract).
      </p>
      <div className="mt-5 flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Address
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Symbol
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Balance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {balances
                    // filter out tokens that the user hasn't deposited yet to the ContractOffsetter
                    .filter((token) => token.balance != "0.0")
                    .map((token, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <Link
                            href={`https://mumbai.polygonscan.com/address/${token.address}`}
                          >
                            <a className="text-pink-600 hover:text-pink-900">
                              {token.address.substring(0, 15) + "..."}
                            </a>
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {token.symbol}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {token.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {token.balance}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalancesTable;
