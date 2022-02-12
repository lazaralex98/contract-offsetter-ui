import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message: string;
  data?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const fetchTransactionsOfAddress = async (address: string) => {
    let response = await fetch(
      `https://api-testnet.polygonscan.com/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${process.env.POLYGONSCAN_API_KEY}`
    );
    let data = await response.json();
    return data;
  };

  const address = req.query["address"];

  if (!address) {
    res.status(500).json({ message: "You need to provide a valid address." });
  }

  // @ts-ignore
  const data: any = await fetchTransactionsOfAddress(address);

  if (data.message != "OK") {
    res.status(500).json({
      message: "Some error occurred when fetching from PolygonScan.",
      data: data,
    });
  }

  res.status(200).json({ message: "OK", data: data });
}
