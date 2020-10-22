import { CreateTransactionStatus, PartialTransaction, AssetTransactionData } from '../../../../types';
import { createTx } from '../../lib/createTx';

export async function createTransaction(
  transactionData: AssetTransactionData[],
): Promise<{ status: CreateTransactionStatus; partialTx?: PartialTransaction, tosign?: string[] }> {
  try {
    const {tx, tosign} = await createTx(transactionData, transactionData[0].fromAddress);
    return { status: 'OK', partialTx: tx, tosign };
  } catch (error) {
    console.log(error.response.data)
    return { status: 'ERROR' };
  }
}
