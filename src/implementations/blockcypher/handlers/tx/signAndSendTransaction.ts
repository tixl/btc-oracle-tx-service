import { SignAndSendResponse } from '../../../../types';
import { combineAndSend } from '../../lib/combineAndSend';
import { logger } from '../../../../log';

export async function signAndSendTransaction(
  partialTx: object,
  tosign: string[],
  signatures: string[],
  publicKey: string,
): Promise<SignAndSendResponse> {
  try {
    const { hash, alreadyExists } = await combineAndSend(partialTx, tosign, signatures, publicKey);
    logger.info('Sign and Send OK', { hash, alreadyExists });
    if (alreadyExists) {
      return { status: 'ALREADY_KNOWN', hash };
    }
    return { status: 'OK', hash };
  } catch (error) {
    logger.error('Sign And Send Error', { error });
    return { status: 'ERROR' };
  }
}
