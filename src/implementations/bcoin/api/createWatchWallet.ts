import axios from 'axios';

export async function createWatchWallet() {
  const walletId = process.env.BCOIN_WALLET_ID;
  const walletUrl = `${process.env.BCOIN_WALLET_URL}/wallet/${walletId}`;
  // it should be fine to use any key here, since we add unrelatd addresses
  const extendedPublicKey = process.env.EXTENDED_RANDOM_PUBKEY;
  if (!extendedPublicKey) {
    throw 'No extended public key';
  }
  const passphrase = process.env.BCOIN_WALLET_PASSPHRASE;
  if (!passphrase) {
    throw 'No passphrase set';
  }
  console.log(`Try create watch wallet with id ${walletId}`);
  try {
    const res = await axios.put(
      walletUrl,
      {
        watchOnly: true,
        accountKey: extendedPublicKey,
        passphrase,
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
