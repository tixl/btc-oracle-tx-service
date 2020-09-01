import { TransactionInformation } from '../../../../types';
import { getTx, BlockCypherTransaction } from '../../lib/getTx';
import * as _ from 'lodash';

const REQUIRED_CONFIRMATIONS = process.env.REQUIRED_CONFIRMATIONS || 6;

export async function getTransactionInformation(
  txReference: string,
  poolAddress: string,
): Promise<TransactionInformation> {
  let result: TransactionInformation;
  try {
    const apiResult = await getTx(txReference);
    if (!apiResult) {
      result = { status: 'NOT_ACCEPTED' };
    } else if (apiResult.confirmations < REQUIRED_CONFIRMATIONS) {
      result = { status: 'PENDING' };
    } else {
      const receivedAmount = calculateReceivedAmount(apiResult, poolAddress);
      const sender = getSenders(apiResult);
      result = { status: 'ACCEPTED', receivedAmount, sender };
    }
  } catch (error) {
    result = { status: 'ERROR', error: error.response.data } as any;
  }

  return result;
}

function getSenders(tx: BlockCypherTransaction) {
  return _.flatten(tx.inputs.map((i) => i.addresses));
}

function calculateReceivedAmount(tx: BlockCypherTransaction, toAddress: string) {
  let amount = 0;
  if (tx.outputs) {
    tx.outputs.forEach((output) => {
      if (output.addresses[0] === toAddress) {
        amount += output.value;
      }
    });
  }
  return String(amount);
}
