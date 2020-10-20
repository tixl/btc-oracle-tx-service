import { PartialTransaction, SignAndSendStatus } from '../../../../types';
import { combineTxSigs } from '../../lib/combineTxSigs';
import { get } from 'lodash';
import axios from 'axios';

export async function signAndSendTransaction(
  partialTx: PartialTransaction,
  signatures: string[],
): Promise<SignAndSendStatus> {
  try {
    const publicKey = '03de75e92d17d68353d2ac814e01741e9ed822073b381f423b3c6cb72e01150891';
    console.log({partialTx, signatures})
    const signed = await combineTxSigs(partialTx, signatures, publicKey);
    if (!signed) {
      return 'INVALID_SIGNATURES';
    }

    const raw = get(signed, 'hex');
    console.log(raw);
    const res = await axios.post(
      `${process.env.BCOIN_URL}`,
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
