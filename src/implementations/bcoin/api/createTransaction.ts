import axios from 'axios';

export async function createTransaction(payload: object): Promise<{ tx?: any; error?: any }> {
  const wallet = process.env.BCOIN_WALLET_ID;
  const walleturl = `${process.env.BCOIN_WALLET_URL}/wallet`;
  try {
    const res = await axios.post(`${walleturl}/${wallet}/create`, payload, {
      auth: { username: 'x', password: process.env.BCOIN_PASSWORD || '' },
    });

    if (res.status !== 200 || !res.data) {
      return { error: 'ERROR' };
    }
    return { tx: res.data };
  } catch (error) {
    console.log(error);
    console.log(error.response.data);
    return { error: error.response.data };
  }
}
