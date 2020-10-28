import bitcoinMessage from 'bitcoinjs-message';

export async function validateSignature(address: string, signature: string, message: string): Promise<boolean> {
  return bitcoinMessage.verify(message, address, signature, undefined, true);
}
