# Oracle and Transaction Service

## Purpose
The oracle part is for getting information from the bitcoin blockchain. The Transaction Service is to create transaction in the BTC network.

## Usage
You need a bcoin API. 
Environment: 
- BCOIN_URL: url with http prefix of the api
- BCOIN_PASSWORD: bcoin api token
- REQUIRED_CONFIRMATIONS: (default 6) confirmations required to deem a block as accepted.

`yarn start`

## Open Bounty

The implementation of the function `src/implementations/bcoin/lib/getTosigns.ts` and `src/implementations/bcoin/lib/combineTxSigs.ts` are open for bounty.
Knowledge in how bitcoin transactions are built and signed are required to implement this functions. Any method of the bcoin API, or npm library might be used.
Each implementation is rewarded with `0,013 BTC` (currently ~150 USD) or `1,5 MTXLT` (currently ~175 USD). For anyone, who implements **both** functions, `0,035 BTC` (currently ~400 USD) or `4,5 MTXLT` (currently ~520 USD) are awarded.
The reward goes to the first accepted pull request.  

For further details or questions send an email to bernd@tixl.me or message @bstrehl on Telegram. 