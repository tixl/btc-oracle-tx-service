import { PartialTransaction, SignAndSendStatus } from '../../../../types';

export async function signAndSendTransaction(
  _partialTx: PartialTransaction,
  _signatures: string[],
): Promise<SignAndSendStatus> {
  const result = 'OK';
  return result;
}
