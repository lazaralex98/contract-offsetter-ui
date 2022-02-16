import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message: string;
  data?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const fetchTransactionsOfAddress = async (
    address: string,
    endBlock: string
  ) => {
    let response = await fetch(
      `https://api-testnet.polygonscan.com/api?module=account&action=txlist&address=${address}&startblock=0&endblock=${endBlock}&sort=desc&apikey=${process.env.POLYGONSCAN_API_KEY}`
    );
    let data = await response.json();
    return data;
  };

  const { address, endBlock } = req.body;

  if (!address) {
    res.status(500).json({ message: "You need to provide a valid address." });
  }

  // @ts-ignore
  const data: any = await fetchTransactionsOfAddress(address, endBlock);
  console.log("data from fetchTransactionsOfAddress", data);

  if (data.message != "OK") {
    res.status(500).json({
      message: data.message,
      data: data,
    });
  } else {
    res.status(200).json({ message: "OK", data: data });
  }
}
