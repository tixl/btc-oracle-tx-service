import { BcoinTransactionInfo } from './getTx';
import { map } from 'lodash';
import { Transaction, crypto } from 'bitcoinjs-lib';

export async function getTosigns(_txs: BcoinTransactionInfo): Promise<(string | null)[]> {
  return map(_txs.inputs, (input, index) => {
    const tx = Transaction.fromHex(_txs.hex);
    tx.setInputScript(index, Buffer.from(input.coin.script, 'hex'));

    let buffer = tx.toBuffer()
    buffer = Buffer.alloc(buffer.length + 4, buffer);

    // append the hash type
    buffer.writeInt32LE(0x1, buffer.length - 4);

    const hash = crypto.sha256(crypto.sha256(buffer));
    return hash.toString('hex');
  });
}
