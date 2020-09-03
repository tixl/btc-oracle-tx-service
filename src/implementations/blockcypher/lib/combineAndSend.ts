import axios from 'axios';
import { BlockcypherPartialTx } from './createTx';

export async function combineAndSend(partialTx: BlockcypherPartialTx, signatures: string[], publicKey: string) {
  try {
    const res = await axios.post(`${process.env.BLOCKCYPHER_URL}/txs/new`, {
      tx: partialTx,
      tosign: partialTx.tosign,
      signatures,
      pubkeys: signatures.map((_x) => publicKey),
    });
    if (res.data && res.data.tx && res.data.tx.received) {
      return true;
    } else {
      throw 'No response body';
    }
  } catch (error) {
    throw error;
  }
}
