import { validateSignature as libValidateSignature } from '../../lib/validateSignature';
import { logger } from '../../../../log';

export async function validateSignature(
  message: string,
  address: string | string[],
  signature: string,
): Promise<boolean> {
  try {
    if (Array.isArray(address)) {
      const results = await Promise.all(address.map((adr) => libValidateSignature(adr, signature, message)));
      const anyValid = results.some((x) => x);
      return anyValid;
    } else {
      const apiResult = await libValidateSignature(address, signature, message);
      return apiResult;
    }
  } catch (error) {
    logger.error('Error validating signature', { error });
    console.log(error)
    return false;
  }
}
