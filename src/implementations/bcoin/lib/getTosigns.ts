import { BcoinTransactionInfo } from './getTx';

export async function getTosigns(_tx: BcoinTransactionInfo): Promise<string[]> {
  // TODO: Get strings that are ready to be signed from the transaction.
  // Unsigned transaction object looks like this: https://bcoin.io/api-docs/index.html#create-a-transaction
  // This should be analogous to the tosigns in the blockcypher API https://www.blockcypher.com/dev/bitcoin/#creating-transactions
  return [];
}
