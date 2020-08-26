import { CreateTransactionStatus, PartialTransaction, AssetTransactionData } from '../../../../types';

export async function createTransaction(
  _transactionData: AssetTransactionData[],
): Promise<{ status: CreateTransactionStatus; partialTx?: PartialTransaction }> {
  const result: { status: CreateTransactionStatus; partialTx: PartialTransaction } = {
    status: 'OK',
    partialTx: {
      some: 'field',
      toSign: ['signthis', 'andalsothis'],
    },
  };
  return result;
}
