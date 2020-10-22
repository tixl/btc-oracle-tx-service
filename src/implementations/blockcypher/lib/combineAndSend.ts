import axios from 'axios';

export async function combineAndSend(
  partialTx: object,
  tosign: string[],
  signatures: string[],
  publicKey: string,
): Promise<string> {
  try {
    const payload = {
      tx: partialTx,
      tosign: tosign,
      signatures,
      pubkeys: signatures.map((_x) => publicKey),
    };
    console.log(JSON.stringify(payload, null, 2));
    const res = await axios.post(`${process.env.BLOCKCYPHER_URL}/txs/send`, payload);
    //TODO: Logger
    console.log(res.data);
    if (res.data && res.data.tx && res.data.tx.hash) {
      return res.data.tx.hash;
    } else {
      throw 'No response body';
    }
  } catch (error) {
    //TODO: Logger
    console.log(error.response.data);
    const errors = error.response.data.errors as { error: string }[];
    if (errors.find((x) => x.error.endsWith('already exists.'))) {
      throw 'ALREADY_EXISTS';
    }
    throw 'ERROR IN REQUEST';
  }
}
