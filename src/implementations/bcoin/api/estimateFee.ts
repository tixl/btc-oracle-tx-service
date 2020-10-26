import axios from 'axios';

export async function estimateFee(): Promise<number | null> {
  try {
    const res = await axios.get(`${process.env.BCOIN_URL}/fee?blocks=3`, {
      auth: { username: 'x', password: process.env.BCOIN_PASSWORD || '' },
    });
    if (res.data && res.data.rate) {
      return res.data.rate as number;
    } else return null;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    } else return null;
  }
}
