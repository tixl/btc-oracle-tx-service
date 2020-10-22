import axios from 'axios';

export async function combineAndSend(
  partialTx: object,
  tosign: string[],
  signatures: string[],
  publicKey: string,
): Promise<string> {
  try {
    const res = await axios.post(`${process.env.BLOCKCYPHER_URL}/txs/new`, {
      tx: partialTx,
      tosign: tosign,
      signatures,
      pubkeys: signatures.map((_x) => publicKey),
    });
    console.log(res.data);
    if (res.data && res.data.tx && res.data.tx.hash) {
      return res.data.tx.hash;
    } else {
      throw 'No response body';
    }
  } catch (error) {
    throw error;
  }
}
