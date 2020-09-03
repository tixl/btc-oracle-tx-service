import axios from 'axios';

export async function broadcastTx(rawTx: string): Promise<void> {
  return axios.post(
    `${process.env.BCOIN_URL}/broadcast`,
    {
      tx: rawTx,
    },
    {
      auth: { username: 'x', password: process.env.BCOIN_PASSWORD || '' },
    });
}