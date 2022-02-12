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

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  client
    .query({
      query: tokensQuery,
    })
    .then((data) => {
      console.log("Subgraph data: ", data.data.tco2Tokens);
      res.status(200).json(data.data.tco2Tokens);
    })
    .catch((err) => {
      console.log("Error fetching data: ", err);
      res.status(500).json(err);
    });
}
