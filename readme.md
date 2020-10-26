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

### bcoin Setup

Required Environment: 
- BCOIN_WALLET_URL
- BCOIN_PASSWORD
- BCOIN_WALLET_ID: The id of the wallet, that should be created 
- EXTENDED_RANDOM_PUBKEY: An public key in extended format. A random key is fine, since we'll import a diffrent address. Can be generated here: https://iancoleman.io/bip39
- BCOIN_WALLET_PASSPHRASE: Passphrase to secure the wallet
- POOL_ADDRESS: Address that should be added. This is the only address we can send from
- BCOIN_RESCAN_HEIGHT: After adding of the pool address, existing transactions are not visible. Use the height of the earliest transaction from/to the pool.

Run `yarn bcoin-setup`


Use `yarn bcoin-info` to get info about the wallet with the configured wallet-id.