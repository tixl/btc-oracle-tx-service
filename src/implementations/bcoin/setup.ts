require('dotenv').config();
import { addAddressToWatchWallet } from './api/addAddressToWatchWallet';
import { createWatchWallet } from './api/createWatchWallet';
import { rescan } from './api/rescan';

// This script is required to setup the pool address for usage with Bcoin
export async function setup() {
  const poolAddress = process.env.POOL_ADDRESS;
  if (!poolAddress) {
    console.log('Pool Address is missing');
    process.exit(1);
  }
  try {
    const create = await createWatchWallet();
    if (create.status !== 'SUCCESS') {
      console.log('Error creating watch wallet');
      process.exit(1);
    }
    const add = await addAddressToWatchWallet(poolAddress);
    if (add.status !== 'SUCCESS') {
      console.log('Error adding address to wallet');
      process.exit(1);
    }
    const rescanCall = await rescan();
    if (rescanCall.status !== 'SUCCESS') {
      console.log('Error doing rescan');
      process.exit(1);
    }
    console.log('Setup succesful');
    process.exit(0);
  } catch (error) {
    console.log('Error in setup script', error);
    process.exit(1);
  }
}

setup();