import { CreateTransactionStatus, PartialTransaction, AssetTransactionData } from '../../../../types';
import { getTosigns } from '../../lib/getTosigns';

export async function createTransaction(
  _transactionData: AssetTransactionData[],
): Promise<{ status: CreateTransactionStatus; partialTx?: PartialTransaction }> {
  const tx = await getTosigns(_transactionData);
  return { status: 'OK', partialTx: tx };
}
