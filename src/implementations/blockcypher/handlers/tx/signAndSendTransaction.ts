import { SignAndSendResponse } from '../../../../types';
import { combineAndSend } from '../../lib/combineAndSend';

export async function signAndSendTransaction(
  partialTx: object,
  tosign: string[],
  signatures: string[],
  publicKey: string,
): Promise<SignAndSendResponse> {
  try {
    const hash = await combineAndSend(partialTx, tosign, signatures, publicKey);
    return { status: 'OK', hash };
  } catch (error) {
    console.log(error);
    if (error === 'ALREADY_EXISTS') {
      return { status: 'ALREADY_KNOWN' };
    }
    return { status: 'ERROR' };
  }
}
