import { CreateTransactionStatus, PartialTransaction, AssetTransactionData } from '../../../../types';
import { createTx } from '../../lib/createTx';

export async function createTransaction(
  transactionData: AssetTransactionData[],
): Promise<{ status: CreateTransactionStatus; partialTx?: PartialTransaction }> {
  try {
    const tx = await createTx(transactionData, transactionData[0].fromAddress);
    return { status: 'OK', partialTx: tx };
  } catch (error) {
    console.log(error.response.data)
    return { status: 'ERROR' };
  }
}
