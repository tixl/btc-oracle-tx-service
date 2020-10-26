import { SignAndSendResponse } from '../../../../types';
import { combineAndSend } from '../../lib/combineAndSend';

export async function signAndSendTransaction(
  partialTx: object,
  tosign: string[],
  signatures: string[],
  publicKey: string,
): Promise<SignAndSendResponse> {
  try {
    const { hash, alreadyExists } = await combineAndSend(partialTx, tosign, signatures, publicKey);
    if (alreadyExists) {
      return { status: 'ALREADY_KNOWN', hash };
    }
    return { status: 'OK', hash };
  } catch (error) {
    console.log(error);
    return { status: 'ERROR' };
  }
}
