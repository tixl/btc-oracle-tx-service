import axios from 'axios';

export async function addAddressToWatchWallet(address: string) {
  const walletId = process.env.BCOIN_WALLET_ID;
  const walletUrl = `${process.env.BCOIN_WALLET_URL}/wallet/${walletId}`;
  const passphrase = process.env.BCOIN_WALLET_PASSPHRASE;
  if (!passphrase) {
    throw 'No passphrase set';
  }
  console.log(`Try to add address ${address} to current watch wallet`);
  try {
    const unlock = await axios.post(
      `${walletUrl}/unlock`,
      { passphrase },
      {
        auth: { username: 'x', password: process.env.BCOIN_PASSWORD || '' },
      },
    );
    if (unlock.status !== 200) {
      console.log('unable to unlock wallet');
      return { status: 'ERROR' };
    } else {
      console.log('wallet unlocked');
    }
    const res = await axios.post(
      `${walletUrl}/import`,
      { address, account: 'default' },
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
