import { validateSignature as libValidateSignature } from '../../lib/ValidateSignature';

export async function validateSignature(
  message: string,
  address: string | string[],
  signature: string,
): Promise<boolean> {
  if (Array.isArray(address)) {
    const results = await Promise.all(address.map((adr) => libValidateSignature(adr, signature, message)));
    const anyValid = results.some((x) => x);
    return anyValid;
  } else {
    const apiResult = await libValidateSignature(address, signature, message);
    return apiResult;
  }
}
