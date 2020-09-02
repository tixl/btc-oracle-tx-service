import { PartialTransaction, FullTransaction } from '../../../types';
import axios from 'axios';

export async function combineTxSigs(_partialTx: PartialTransaction, _signatures: string): Promise<FullTransaction | null> {
  const wallet = 'mywallet';
  const walleturl = `${process.env.BCOIN_URL}/wallet`
  try {
    const res = await axios.post(
      `${walleturl}/${wallet}/sign`,
      {
        tx: _partialTx.hex,
        passphrase: _signatures
      },
      {
        auth: { username: 'x', password: process.env.BCOIN_PASSWORD || '' },
      });

    if (res.status !== 200) {
      return null
    }
    return res.data;
  } catch (error) {
    console.log(error);
    return null
  }
}
