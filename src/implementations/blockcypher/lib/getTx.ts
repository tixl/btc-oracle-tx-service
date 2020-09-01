import axios from 'axios';

interface Input {
  output_value: number;
  addresses: string[];
}

interface Output {
  value: number;
  addresses: string[];
}

export interface BlockCypherTransaction {
  hash: string;
  confirmations: number;
  inputs: Input[];
  outputs: Output[];
}

export async function getTx(txHash: string) {
  try {
    const res = await axios.get(`${process.env.BLOCKCYPHER_URL}/txs/${txHash}`);
    if (res.data) {
      return res.data as BlockCypherTransaction;
    } else throw 'Empty body';
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    } else throw error;
  }
}
