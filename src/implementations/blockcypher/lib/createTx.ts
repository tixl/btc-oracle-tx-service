import { AssetTransactionData } from '../../../types';
import axios from 'axios';

export type BlockcypherPartialTx = {
  tosign: string[];
} & object;

export async function createTx(txData: AssetTransactionData[], fromAddress: string) {
  try {
    const BASE_FEE_SAT = process.env.BASE_FEE_SAT ? Number(process.env.BASE_FEE_SAT) : null;
    const FEE_PER_OUTPUT_SAT = process.env.FEE_PER_OUTPUT_SAT ? Number(process.env.FEE_PER_OUTPUT_SAT) : null;
    const SET_FEE_CAP = process.env.SET_FEE_CAP;
    if (BASE_FEE_SAT === null || isNaN(BASE_FEE_SAT) || FEE_PER_OUTPUT_SAT === null || isNaN(FEE_PER_OUTPUT_SAT)) {
      throw 'BASE_FEE_SAT and FEE_PER_OUTPUT_SAT not set';
    }
    const countOutputs = txData.length;
    const estimatedFee = BASE_FEE_SAT + countOutputs * FEE_PER_OUTPUT_SAT;
    const feePerOutput = Math.ceil(estimatedFee / countOutputs);
    const payload: any = {
      inputs: [{ addresses: [fromAddress] }],
      outputs: txData.map((data) => ({
        addresses: [data.toAddress],
        value: Math.max(Number(data.amount) - feePerOutput, 0),
      })),
    };
    if (SET_FEE_CAP === '1') {
      payload.fees = estimatedFee;
    }
    console.log(payload)
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
