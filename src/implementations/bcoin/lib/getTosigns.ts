import { BcoinTransactionInfo } from './getTx';
import { map } from 'lodash';
import { Psbt } from 'bitcoinjs-lib';

export async function getTosigns(_txs: BcoinTransactionInfo): Promise<(string | null)[]> {
  return map(_txs.inputs, input => {
    const psbt = new Psbt();
    psbt.addInput({
      hash: input.prevout.hash, 
      index: input.prevout.index
    });
    psbt.finalizeAllInputs()
    const raw = psbt.extractTransaction().toHex();    
    return raw;
  });
}