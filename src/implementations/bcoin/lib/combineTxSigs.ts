import { PartialTransaction } from '../../../types';
import { Transaction } from 'bitcoinjs-lib';

export async function combineTxSigs(
  _partialTx: PartialTransaction, 
  _signatures: string[], 
  _signerPublicKey: string
): Promise<string> {
  const tx = Transaction.fromHex(_partialTx.hex)

  _signatures.forEach((signature, index) => {
    tx.setInputScript(index, new Buffer(`47${signature}0121${_signerPublicKey}`, 'hex'))
  })

  return { ...tx, hex: tx.toHex() };
}