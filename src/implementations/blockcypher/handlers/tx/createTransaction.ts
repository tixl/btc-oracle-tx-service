import { CreateTransactionStatus, PartialTransaction, AssetTransactionData } from '../../../../types';
import { createTx } from '../../lib/createTx';
import { logger } from '../../../../log';

export async function createTransaction(
  transactionData: AssetTransactionData[],
): Promise<{ status: CreateTransactionStatus; partialTx?: PartialTransaction; tosign?: string[] }> {
  try {
    const { tx, tosign } = await createTx(transactionData, transactionData[0].fromAddress);
    logger.info('Create transaction OK');
    return { status: 'OK', partialTx: tx, tosign };
  } catch (error) {
    let errormsg = error;
    if (error.response && error.response.data) {
      errormsg = error.response.data;
    }
    logger.error('Create transaction error', { error: errormsg });
    return { status: 'ERROR' };
  }
}
