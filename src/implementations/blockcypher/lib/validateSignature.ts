import bitcoreMessage from 'bitcore-message';

export async function validateSignature(address: string, signature: string, message: string): Promise<boolean> {
  const messageToVerify = bitcoreMessage(message);

  return messageToVerify.verify(address, signature);
}
