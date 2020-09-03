import { PartialTransaction, FullTransaction } from '../../../types';

export async function combineTxSigs(
  _partialTx: PartialTransaction, 
  _signatures: string[], 
  _signerPublicKey: string
): Promise<FullTransaction> {
  // TODO1: create object full transaction with signature and tosigns
  // TODO2: sent fullTx to network
  /**
   * example object
   * 
   * var sendtx = {
      tx: _partialTx,
      tosign: [call methond getTosigns()],
      signatures: [_signatures],
      pubkeys: [_signerPublicKey]
    };
   * 
   *  */ 

  // Takes the signatures of the tosigns created by the 'getTosigns" method and the transaction template
  // to create a complete transaction that is ready to be sent to the network
  return {};
}
