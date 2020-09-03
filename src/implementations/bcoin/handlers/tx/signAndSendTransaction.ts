import { PartialTransaction, SignAndSendStatus } from '../../../../types';
import { combineTxSigs } from '../../lib/combineTxSigs';

export async function signAndSendTransaction(
  _partialTx: PartialTransaction,
  _signatures: string[],
): Promise<SignAndSendStatus> {
  try {
    const publicKey = '0226bb03e0190bf8c5647d46e62ac7b4ae48baa56a06cef45fac77fee295c429cf';
    const signed = await combineTxSigs(_partialTx, _signatures, publicKey);
    if (!signed) {
      return 'INVALID_SIGNATURES';
    }
    console.log(signed)
    return 'OK';
  } catch (error) {
    console.log(error);
    return 'ERROR';
  }

}
