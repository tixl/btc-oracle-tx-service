import { PartialTransaction } from '../../../types';
import { Transaction } from 'bitcoinjs-lib';

export async function combineTxSigs(
  partialTx: PartialTransaction, 
  signatures: string[], 
  signerPublicKey: string
): Promise<Transaction> {
  const tx = Transaction.fromHex(partialTx.hex)

  signatures.forEach((signature, index) => {
    tx.setInputScript(index, new Buffer(`47${signature}0121${signerPublicKey}`, 'hex'))
  })

  return tx
}