import { CreateTransactionStatus, PartialTransaction, AssetTransactionData } from '../../../../types';
import { getTosigns } from '../../lib/getTosigns';
import axios from 'axios';
import { map } from 'lodash';

export async function createTransaction(
  _transactionData: AssetTransactionData[],
): Promise<{ status: CreateTransactionStatus; partialTx?: PartialTransaction }> {
  const wallet = 'mywallet';
  const walleturl = `${process.env.BCOIN_URL}/wallet`
  try {
    const res = await axios.post(
      `${walleturl}/${wallet}/create`,
      {
        rate: 1000,
        outputs: map(_transactionData, item => ({address: item.toAddress, value: Number(item.amount)})),
        sign: false
      },
      {
        auth: { username: 'x', password: process.env.BCOIN_PASSWORD || '' },
      });

    if (res.status !== 200) {
      console.log(res.data)
      return { status: 'ERROR' }
    }

    console.log(JSON.stringify(res.data))
    const toSign = await getTosigns(res.data)

    return { status: 'OK', partialTx: { ...res.data, toSign } };
  } catch (error) {
    if (error?.response?.data?.error?.type == 'FundingError') {
      return { status: 'INSUFFICIENT_FUNDS' };
    }
    console.log(error);
    return { status: 'ERROR' };
  }
}
