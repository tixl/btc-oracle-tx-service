import { SignAndSendResponse } from '../../../../types';
import { combineTxSigs } from '../../lib/combineTxSigs';
import axios from 'axios';

export async function signAndSendTransaction(
  partialTx: object,
  _tosign: string[],
  signatures: string[],
  publicKey: string,
): Promise<SignAndSendResponse> {
  try {
    console.log({ partialTx, signatures });
    const signed = await combineTxSigs(partialTx, signatures, publicKey);
    if (!signed) {
      return { status: 'INVALID_SIGNATURES' };
    }

    console.log('signed', signed);
    console.log('raw', signed.toHex());

    const res = await axios.post(
      `${process.env.BCOIN_URL}`,
      {
        method: 'sendrawtransaction',
        params: [signed.toHex()],
      },
      {
        auth: { username: 'x', password: process.env.BCOIN_PASSWORD || '' },
      },
    );
    if (res.data) {
      console.log(res.data);
      if (res.data.error !== null) {
        return { status: 'ERROR' };
      }
      const hash = res.data.result;
      return { status: 'OK', hash };
    }
    return { status: 'ERROR' };
  } catch (error) {
    console.log('ERROR');
    if (error.response) {
      console.log(error.response);
    } else {
      console.log(error);
    }
    return { status: 'ERROR' };
  }
}
