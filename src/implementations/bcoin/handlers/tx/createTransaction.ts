import { CreateTransactionStatus, PartialTransaction, AssetTransactionData } from '../../../../types';
import { getTosigns } from '../../lib/getTosigns';
import axios from 'axios';

export async function createTransaction(
  transactionData: AssetTransactionData[],
): Promise<{ status: CreateTransactionStatus; partialTx?: PartialTransaction }> {
  const wallet = process.env.BCOIN_WALLET_ID
  const walleturl = `${process.env.BCOIN_WALLET_URL}/wallet`;
  try {
    const res = await axios.post(
      `${walleturl}/${wallet}/create`,
      {
        rate: 1000,
        outputs: transactionData.map(x => ({address: x.toAddress, value: Number(x.amount)})),
        sign: false,
      },
      {
        auth: { username: 'x', password: process.env.BCOIN_PASSWORD || '' },
      },
    );

    if (res.status !== 200 || !res.data) {
      return { status: 'ERROR' };
    }
    const partialTx = res.data;

    const toSign = await getTosigns(partialTx);

    return { status: 'OK', partialTx: { ...partialTx, toSign } };
  } catch (error) {
    if (error?.response?.data?.error?.type == 'FundingError') {
      return { status: 'INSUFFICIENT_FUNDS' };
    }
    console.log(error);

    console.log(error.response.data);
    return { status: 'ERROR' };
  }
}
