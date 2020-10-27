import { AssetTransactionData } from '../../../types';
import axios from 'axios';

export type BlockcypherPartialTx = {
  tosign: string[];
} & object;

export async function createTx(txData: AssetTransactionData[], fromAddress: string) {
  try {
    const res = await axios.post(`${process.env.BLOCKCYPHER_URL}/txs/new?token=${process.env.BLOCKCYPHER_TOKEN}`, {
      inputs: [{ addresses: [fromAddress] }],
      outputs: txData.map((data) => ({ addresses: [data.toAddress], value: data.amount })),
    });
    if (res.data) {
      return res.data as { tx: object; tosign: string[] };
    } else {
      throw 'No response body';
    }
  } catch (error) {
    throw error;
  }
}
