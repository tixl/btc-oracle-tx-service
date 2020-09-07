import { PartialTransaction, SignAndSendStatus } from '../../../../types';
import { combineTxSigs } from '../../lib/combineTxSigs';
// import axios from 'axios';

export async function signAndSendTransaction(
  _partialTx: PartialTransaction,
  _signatures: string[],
): Promise<SignAndSendStatus> {
  try {
    const publicKey = '0220e3ae436909dfade128f8f6fcf901a7a20103cb304de59db0646bdd83a00682';
    const signed = await combineTxSigs(_partialTx, _signatures, publicKey);
    if (!signed) {
      return 'INVALID_SIGNATURES';
    }
    console.log(signed);
    // const res = await axios.post(`${process.env.BCOIN_URL}`, { method: 'sendrawtransaction', params: [signed] });
    // if (res.data) {
    //   console.log(res.data);
    // }
    return 'OK';
  } catch (error) {
    console.log(error);
    return 'ERROR';
  }
}
