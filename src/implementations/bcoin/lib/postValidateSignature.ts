import axios from 'axios';

export async function postValidateSignature(address: string, signature: string, message: string): Promise<boolean> {
  try {
    const res = await axios.post(
      `${process.env.BCOIN_URL}`,
      {
        method: 'verifymessage',
        params: [address, signature, message],
      },
      {
        auth: { username: 'x', password: process.env.BCOIN_PASSWORD || '' },
      },
    );
    if (res.data) {
      return res.data.result as boolean;
    } else return false;
  } catch (error) {
    return false;
  }
}
