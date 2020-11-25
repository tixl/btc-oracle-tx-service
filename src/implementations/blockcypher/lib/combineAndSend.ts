import axios from 'axios';
import { logger } from '../../../log';

export async function combineAndSend(
  partialTx: object,
  tosign: string[],
  signatures: string[],
  publicKey: string,
): Promise<{ hash: string; alreadyExists: boolean }> {
  try {
    const payload = {
      tx: partialTx,
      tosign: tosign,
      signatures,
      pubkeys: signatures.map((_x) => publicKey),
    };
    console.log(JSON.stringify(payload, null, 2));
    logger.info('request to blockcypher POST /txs/send');
    const res = await axios.post(
      `${process.env.BLOCKCYPHER_URL}/txs/send?token=${process.env.BLOCKCYPHER_TOKEN}`,
      payload,
    );
    if (res.data && res.data.tx && res.data.tx.hash) {
      return { hash: res.data.tx.hash, alreadyExists: false };
    } else {
      throw 'No response body';
    }
  } catch (error) {
    let errormsg = error;
    if (error.response && error.response.data) {
      errormsg = error.response.data;
    }
    logger.error('combineAndSend error', { error: errormsg });
    const errors = error.response.data.errors as { error: string }[];
    if (errors.find((x) => x.error.endsWith('already exists.') || x.error.endsWith('already in pool'))) {
      return { hash: error.response.data.tx.hash, alreadyExists: true };
    }
    throw 'ERROR IN REQUEST';
  }
}
