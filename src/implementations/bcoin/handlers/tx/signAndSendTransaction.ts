import { PartialTransaction, SignAndSendStatus } from '../../../../types';
import { combineTxSigs } from '../../lib/combineTxSigs';
import { get } from 'lodash';
import axios from 'axios';

export async function signAndSendTransaction(
  _partialTx: PartialTransaction,
  _signatures: string[],
): Promise<SignAndSendStatus> {
  try {
    const publicKey = '02c80fad12ee8895e7cf7ecf555c654f67896fa511929f6bd996733981fd943d1e';
    const signed = await combineTxSigs(_partialTx, _signatures, publicKey);
    if (!signed) {
      return 'INVALID_SIGNATURES';
    }

    const raw = get(signed, 'hex');
    console.log(raw);
    const res = await axios.post(
      `http://68.183.76.162:18334`,
      {
        method: 'sendrawtransaction',
        params: [ raw ]
      },
      {
        auth: { username: 'x', password: process.env.BCOIN_PASSWORD || '' },
      });
    if (res.data) {
      console.log(res.data);
    }
    return 'OK';
  } catch (error) {
    if (error.response) {
      console.log(error.response);
    } else {
      console.log(error);
    }

    return 'ERROR';
  }
}
