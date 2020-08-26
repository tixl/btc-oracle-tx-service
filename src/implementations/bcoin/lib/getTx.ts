import axios from 'axios';

interface Input {
  prevout: { hash: string; index: number };
  script: string;
  witness: string;
  sequence: string;
  address?: string | null;
  coin: {
    value: number;
    address: string;
  };
}

interface Output {
  value: number;
  script: string;
  address: string;
}

export interface BcoinTransactionInfo {
  hash: string;
  height: number;
  block: string;
  inputs: Input[];
  outputs: Output[];
  confirmations: number;
}

export async function getTx(txHash: string): Promise<BcoinTransactionInfo | null> {
  try {
    const res = await axios.get(`${process.env.BCOIN_URL}/tx/${txHash}`, {
      auth: { username: 'x', password: process.env.BCOIN_PASSWORD || '' },
    });
    if (res.data) {
      return res.data as BcoinTransactionInfo;
    } else throw 'Empty body';
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    } else throw error;
  }
}
