import axios from 'axios';

export async function rescan() {
  const walletUrl = `${process.env.BCOIN_WALLET_URL}/rescan`;
  // it should be fine to use any key here, since we add unrelatd addresses
  const rescanHeight = process.env.BCOIN_RESCAN_HEIGHT;
  if (!rescanHeight || isNaN(Number(rescanHeight))) {
    throw 'No (valid) rescan height';
  }
  console.log(`Try rescan to height ${rescanHeight}`);
  try {
    const res = await axios.post(
      walletUrl,
      {
        height: Number(rescanHeight),
      },
      {
        auth: { username: 'x', password: process.env.BCOIN_PASSWORD || '' },
      },
    );
    console.log(res.data);

    if (res.status !== 200 || !res.data) {
      return { status: 'ERROR' };
    } else {
      return { status: 'SUCCESS' };
    }
  } catch (error) {
    console.log('ERROR:');
    console.log(error.response.data);
    return { status: 'ERROR' };
  }
}
