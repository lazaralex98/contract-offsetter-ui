# A dapp to offset to the footprint of your wallet or contracts

We are using the `ContractOffsetter` contract for which [you have a repo here](https://github.com/lazaralex98/eco-1/blob/main/contracts/ContractOffsetter.sol), and you have [a link to its polygonscan here](https://mumbai.polygonscan.com/address/0x4F828CeDAfcBa0cDd2d9Ace14caFfb0b1FaF9199).

In this README I will describe the dapp, for a [description of the contract itself go here](https://github.com/lazaralex98/eco-1/blob/main/README.md).

## The user journey

The user comes in on the landing page and connects his wallet.

He is redirected to a dashboard where he has the options to load the transactions of the wallet he connected with, or go to another view.

One thing that happens behind the scenes when the user connects his wallet is that we fetch and load his token balances within `ContractOffsetter` and store these in an app-wide React state.

### The dashboard view

Once the user clicks on "Load my transactions" the app fetches all the needed data (overall gas, overall emmissions, etc) and displays 3 parts:

1. A mini-form where the user can select a TCO2 (that he has in his in-contract balance) and click the "offsetAll" btn.
   This would attempt to use the `offset()` method of the `ContractOffsetter` contract. Once that's done, we refetch the transactions and balances.
2. A few stats: overall gas used from all transactions, the amount of CO2 in kg that's left to offset, and how much that'd cost in TCO2.
   These numbers are acquired by using the `avg. transaction = 0.00036 kg of CO2` factor we came up with. Not the best number, as I said previously, but works for now.
3. A table containing all transactions with the following for each: a hash with a link to polygonscan, the amount of gas used, the nonce, the transaction status, and wether it was offset or not.
   We are using the Polygonscan API to get these, except for the `OffsetStatus`... that's something we get from the `ContractOffseter`.

_Side note: `ContractOffsetter` does not contain an offset status for each transaction, it contains the nonce of the last offset transaction and that's how we differentiate between offset and not offset transactions._

### The offset view(s)

In big part, this is just repeating what was happening in the dashboard, only here the user can offset the transactions of other addresses.

By going to the `/offset` path (either from the navbar or using a btn in the dashboard), the user is presented with a form where he can input the address of the contract he wants to offset.

This redirects him to `/offset/{address}` which is virtually the same as the dashboard view, except for the chosen address.

### The deposit view

The deposit view has a form where the user can deposit BCT or TCO2. Which reminds me, to get a list of all eligible TCO2s we are using Subpgrah, but I shall explain these underlying functions/utils later.

The deposit view also displays a table with all in-contract (in `ContractOffsetter` that is) balances of the connected wallet.

The table only displays token that the user has within the contract, not all eligible tokens.

Once the user picks the amount & token that he wants to deposit and he hits the "deposit" btn a function attempts to use the `deposit()` method of the `ContractOffsetter`. It's important to note that the user will have to first approve the transaction, then to actually sign the transaction from his Metamask. This happens because we are using the IERC20 `safeTransferFrom()` method.

Of course, after the deposit is done, we refetch the balances.

### The redeem view

The redeem view is quite similar to the deposit one (a form + a balances table), except that this form will redeem BCT the user has within `ContractOffsetter` for TCO2 tokens of his choice.

The selector only displays TCO2 tokens that the BCT pool actually currently holds. And we get this info (and store it in the app-wide React state) at the same times when we fetch the user's balances. Again, these functions will be explained more in-depth a bit later.

### The balances table

Since we already saw this in 2 view, I think we should quickly describe it. It takes the balances array from the app-wide React state and renders a table that contains the token address (with a link to polygonscan), the token symbol and it's full name + the amount that the user holds within the `ContractOffsetter`.

### The help view

Lastly, you will notice the help page. This (at the time of me writing this README) is empty, but it will be populated with information/content on how to use the dapp.

## Behind the scenes

There are quite a few functions, utils and API endpoints that need to be explained. Let's first enumerate them and then we'll explain them:

- `fetchAndFormatTransactions()`
- `fetchNonceOfLastOffset()`
- `fetchBalances()`
- `fetchDepositableTokenTypes()`
- `/api/getAllTCO2Types`
- `/api/getTransactionsOfAddress`

### fetchAndFormatTransactions()

This function uses the `/api/getTransactionsOfAddress` endpoint to get a (blocknumber descendant) list of transactions of the queryied address.

The endpoint can only return 10k Txns at a time, so I've made a recursive function (called within the `fetchAndFormatTransactions()` function) that checks whether we have hit that limit and re-fetches another list of Txns starting with the blocknumber of the earliest transaction (within the previous array).

The recursive function will run and re-run until we don't hit the 10k limit anymore and this allows us to fetch all of someone's transactions even if it's over 10k Txns.

_Side note: if the user has tens (or hundreds) of thousands of transactions this can become a pretty long loading screen for him_

Once we have a list of all transactions, as fetched from Polygonscan (don't worry, I'll explain our endpoint later), we format them:

- we filter out transactions where the data is incomplete (missing hashes, nonces, etc)
- we check wether each transaction has been offset or not using the `nonceOflastOffset` which we get from the `fetchNonceOfLastOffset()` function

I do acknowledge this function is a mess. A lot of stuff is a mess in this codebase. That's the perils of working on a tight deadline. We'll clean it up in time.
