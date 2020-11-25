import { AssetTransactionData } from '../../../types';
import axios from 'axios';
import { logger } from '../../../log';

export type BlockcypherPartialTx = {
  tosign: string[];
  tx: { fees: number } & object;
} & object;

function mapTxData(txData: AssetTransactionData[], fromAddress: string, feePerOutput: number = 0) {
  return {
    inputs: [{ addresses: [fromAddress] }],
    outputs: txData.map((data) => ({
      addresses: [data.toAddress],
      value: Math.floor(Number(data.amount) - feePerOutput),
    })),
  };
}

export async function createTx(txData: AssetTransactionData[], fromAddress: string) {
  try {
    const countOutputs = txData.length;
    const payloadForFeeTx = mapTxData(txData, fromAddress);
    const firstTx = await blockcypherCreateTx(payloadForFeeTx);
    const fees = firstTx.tx.fees;
    const feePerOutput = Math.ceil(fees / countOutputs);
    logger.info('Got fees', { fees, feePerOutput });
    const outputsHighEnough = txData.filter((data) => Number(data.amount) > feePerOutput);
    if (outputsHighEnough.length === 0) {
      throw 'No outputs that are high enough to pay fees';
    }
    const payloadForRealTx = mapTxData(outputsHighEnough, fromAddress, feePerOutput);
    logger.info('Create transaction payload', payloadForRealTx);
    const res = blockcypherCreateTx({ ...payloadForRealTx, fees });
    return res;
  } catch (error) {
    throw error;
  }
}

async function blockcypherCreateTx(payload: any): Promise<BlockcypherPartialTx> {
  try {
    logger.info('request to blockcypher POST /txs/new');
    const res = await axios.post(
      `${process.env.BLOCKCYPHER_URL}/txs/new?token=${process.env.BLOCKCYPHER_TOKEN}`,
      payload,
    );
    if (res.data) {
      return res.data as BlockcypherPartialTx;
    } else {
      throw 'No response body';
    }
  } catch (error) {
    throw error;
  }
}
