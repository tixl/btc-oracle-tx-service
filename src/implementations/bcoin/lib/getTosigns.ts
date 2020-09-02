import axios from 'axios';
import { AssetTransactionData, PartialTransaction } from '../../../types';
import { map } from 'lodash';

export async function getTosigns(_txs: AssetTransactionData[]): Promise<PartialTransaction | null> {
  const wallet = 'mywallet';
  const walleturl = `${process.env.BCOIN_URL}/wallet`
  try {
    const res = await axios.post(
      `${walleturl}/${wallet}/create`,
      {
        rate: 1000,
        outputs: map(_txs, item => ({address: item.toAddress, value: Number(item.amount)})),
        sign: false
      },
      {
        auth: { username: 'x', password: process.env.BCOIN_PASSWORD || '' },
      });

    if (res.status !== 200) {
      return null
    }

    return res.data;
  } catch (error) {
    return null;
  }
}
