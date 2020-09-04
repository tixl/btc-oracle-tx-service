import { PartialTransaction, SignAndSendStatus } from '../../../../types';
import { combineTxSigs } from '../../lib/combineTxSigs';
import axios from 'axios';

export async function signAndSendTransaction(
  _partialTx: PartialTransaction,
  _signatures: string[],
): Promise<SignAndSendStatus> {
  try {
    const publicKey = '039d200d2ec5c780c4db2ece1f1fecaf63e2e2e68cc967eb06b729f569eddd41c2';
    const signed = await combineTxSigs(_partialTx, _signatures, publicKey);
    if (!signed) {
      return 'INVALID_SIGNATURES';
    }
    console.log(signed);
    const res = await axios.post(`${process.env.BCOIN_URL}`, { method: 'sendrawtransaction', params: [signed] });
    if (res.data) {
      console.log(res.data);
    }
    return 'OK';
  } catch (error) {
    console.log(error);
    return 'ERROR';
  }
}
