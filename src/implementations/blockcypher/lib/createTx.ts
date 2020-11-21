import { AssetTransactionData } from '../../../types';
import axios from 'axios';
import { logger } from '../../../log';

export type BlockcypherPartialTx = {
  tosign: string[];
} & object;

export async function createTx(txData: AssetTransactionData[], fromAddress: string) {
  try {
    const countOutputs = txData.length;
    const fees = await getFee(countOutputs);
    if (fees === null) {
      throw 'Can not get fees';
    }
    console.log({ fees });
    const feePerOutput = Math.ceil(fees / countOutputs);
    const outputsHighEnough = txData.filter((data) => Number(data.amount) > feePerOutput);
    if (outputsHighEnough.length === 0) {
      throw 'No outputs that are high enough to pay fees';
    }
    const payload: any = {
      inputs: [{ addresses: [fromAddress] }],
      outputs: outputsHighEnough.map((data) => ({
        addresses: [data.toAddress],
        value: Number(data.amount) - feePerOutput,
      })),
      fees,
    };
    logger.info('Create transaction payload', payload);
    const res = await axios.post(
      `${process.env.BLOCKCYPHER_URL}/txs/new?token=${process.env.BLOCKCYPHER_TOKEN}`,
      payload,
    );
    if (res.data) {
      return res.data as { tx: object; tosign: string[] };
    } else {
      throw 'No response body';
    }
  } catch (error) {
    throw error;
  }
}

async function getBlockchainInfo() {
  try {
    const res = await axios.get(process.env.BLOCKCYPHER_URL!);
    if (res.data) {
      return res.data as { medium_fee_per_kb: number };
    } else return null;
  } catch (err) {
    const error = err.response && err.reponse.data ? err.response.data : err;
    logger.error('Error blockcypher getBlockchainInfo', { error });
    return null;
  }
}

let feePerKb: number | null = null;

async function updateFee() {
  const fee = await getBlockchainInfo();
  if (!fee) {
    logger.error('Cant update fee');
  } else {
    logger.info('Update fee from blockcypher', { feePerKb: fee.medium_fee_per_kb });
    feePerKb = fee.medium_fee_per_kb;
  }
}

setInterval(() => {
  updateFee();
}, 10 * 60 * 1000);
updateFee();

async function getFee(outputs: number = 1) {
  if (process.env.SET_FEE_CAP !== '1') {
    if (feePerKb) {
      const baseSize = 0.225;
      const sizePerOutput = 0.02;
      return Math.floor((baseSize + outputs * sizePerOutput) * feePerKb);
    } else return null;
  } else {
    const BASE_FEE_SAT = process.env.BASE_FEE_SAT ? Number(process.env.BASE_FEE_SAT) : null;
    const FEE_PER_OUTPUT_SAT = process.env.FEE_PER_OUTPUT_SAT ? Number(process.env.FEE_PER_OUTPUT_SAT) : null;
    if (BASE_FEE_SAT === null || isNaN(BASE_FEE_SAT) || FEE_PER_OUTPUT_SAT === null || isNaN(FEE_PER_OUTPUT_SAT)) {
      return null;
    }
    const estimatedFee = BASE_FEE_SAT + outputs * FEE_PER_OUTPUT_SAT;
    return Math.floor(estimatedFee);
  }
}
