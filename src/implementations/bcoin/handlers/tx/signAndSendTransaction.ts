import { PartialTransaction, SignAndSendStatus } from '../../../../types';
import { combineTxSigs } from '../../lib/combineTxSigs';
import { broadcastTx } from '../../lib/broadcastTx';

export async function signAndSendTransaction(
  _partialTx: PartialTransaction,
  _signatures: string[],
): Promise<SignAndSendStatus> {
  try {
    const signed = await combineTxSigs(_partialTx, _signatures[0]);
    if (!signed) {
      return 'INVALID_SIGNATURES';
    }
    await broadcastTx(signed.hex);
    return 'OK';
  } catch (error) {
    return 'ERROR';
  }

}
