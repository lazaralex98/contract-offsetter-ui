import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import type { NextApiRequest, NextApiResponse } from "next";

const APIURL = "https://api.thegraph.com/subgraphs/name/co2ken/staging";

const tokensQuery = gql`
  query {
    tco2Tokens {
      name
      symbol
      address
    }
  }
`;

const client = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const response = await client.query({
    query: tokensQuery,
  });

  console.log(response);

  if (response.networkStatus == 7) {
    res.status(200).json(response.data.tco2Tokens);
  } else {
    res.status(500).json(response);
  }
}
