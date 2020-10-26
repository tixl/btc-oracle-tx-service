import { BcoinTransactionInfo } from '../api/getTx';
import { map } from 'lodash';
import { Transaction, crypto } from 'bitcoinjs-lib';

export async function getTosigns(txs: BcoinTransactionInfo): Promise<string[]> {
  return map(txs.inputs, (input, index) => {
    const tx = Transaction.fromHex(txs.hex);
    tx.setInputScript(index, Buffer.from(input.coin.script, 'hex'));

    let buffer = tx.toBuffer()
    buffer = Buffer.alloc(buffer.length + 4, buffer);

    // append the hash type
    buffer.writeInt32LE(0x1, buffer.length - 4);

    const hash = crypto.sha256(crypto.sha256(buffer));
    return hash.toString('hex');
  });
}
