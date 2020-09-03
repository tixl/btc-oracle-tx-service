import { BcoinTransactionInfo } from './getTx';
import { map } from 'lodash';
import { TransactionBuilder } from 'bitcoinjs-lib';


export async function getTosigns(_txs: BcoinTransactionInfo): Promise<(string | null)[]> {
  return map(_txs.inputs, input => {
    const transactionBuilder = new TransactionBuilder();
    transactionBuilder.addInput(input.prevout.hash, input.prevout.index);
    const tx = transactionBuilder.buildIncomplete();
    return tx.getHash().toString('hex');
  });
}