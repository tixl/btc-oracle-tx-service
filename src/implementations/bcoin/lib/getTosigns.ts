import { BcoinTransactionInfo } from './getTx';
import { map } from 'lodash';
import * as bitcoin from 'bitcoinjs-lib';

const network = bitcoin.networks.testnet;

export async function getTosigns(_txs: BcoinTransactionInfo): Promise<(string | null)[]> {
  return map(_txs.inputs, (input) => {
    const psbt = new bitcoin.Psbt({ network: network });
    psbt.addInput({
      hash: input.prevout.hash,
      index: input.prevout.index,
      nonWitnessUtxo: Buffer.from(
        '0100000001f81414167f86ccec37d93273a9bc0c53fb2708106c234db843924c44445d04e00100000000ffffffff02e80300000000000017a91457c4858c4ebbac0ddaef98bd7bea1cfb5723a91b87773d0f00000000001976a914100bf2d214cc47a6ac6d71e4f27577956cfb737988ac00000000',
        'hex',
      ),
    });
    const raw = psbt.extractTransaction().getHash().toString('hex');
    return raw;

    // const transactionBuilder = new Bitcoin.TransactionBuilder();
    // transactionBuilder.addInput(input.prevout.hash, input.prevout.index);
    // const tx = transactionBuilder.buildIncomplete();
    // return tx.getHash().toString('hex');
  });
}