require('dotenv').config();
import { walletInfo } from './api/walletInfo';

export async function info() {
  const res = await walletInfo();
  if (res.status === 'ERROR') {
    console.log('Error getting info. Probably doesnt exist.');
    process.exit(0);
  } else {
    console.log('Wallet info:');
    console.log(res.info!);
    process.exit(0);
  }
}
info();
