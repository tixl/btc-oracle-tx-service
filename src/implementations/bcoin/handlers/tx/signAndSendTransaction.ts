import { PartialTransaction, SignAndSendStatus } from '../../../../types';
import { combineTxSigs } from '../../lib/combineTxSigs';
import axios from 'axios';

export async function signAndSendTransaction(
  _partialTx: PartialTransaction,
  _signatures: string[],
): Promise<SignAndSendStatus> {
  try {
    const publicKey = '03c0eb971d742e75310c21c62dc3943b90b8e76270e9b4a5ec04fda5d677084864';
    const signed = await combineTxSigs(_partialTx, _signatures, publicKey);
    if (!signed) {
      return 'INVALID_SIGNATURES';
    }

    console.log(signed);
    const res = await axios.post(
      `${process.env.BCOIN_URL}`,
      {
        method: 'sendrawtransaction',
        params: [ signed ]
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
