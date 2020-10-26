import axios from 'axios';

export async function walletInfo() {
  const walletId = process.env.BCOIN_WALLET_ID;
  const walletUrl = `${process.env.BCOIN_WALLET_URL}/wallet/${walletId}`;
  // it should be fine to use any key here, since we add unrelatd addresses
  console.log(`Try create get wallet info id ${walletId}`);
  try {
    const res = await axios.get(walletUrl, {
      auth: { username: 'x', password: process.env.BCOIN_PASSWORD || '' },
    });
    console.log(res.data);

    if (res.status !== 200 || !res.data) {
      return { status: 'ERROR' };
    } else {
      return { status: 'SUCCESS', info: res.data };
    }
  } catch (error) {
    console.log('ERROR:');
    if (error.response) {
      console.log(error.response?.data);
      console.log('Status Code: ', error.response.status);
    } else {
      console.log(error);
    }

    return { status: 'ERROR' };
  }
}
