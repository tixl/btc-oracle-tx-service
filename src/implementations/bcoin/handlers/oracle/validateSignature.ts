import { postValidateSignature } from "../../lib/postValidateSignature";

export async function validateSignature(message: string, address: string, signature: string): Promise<boolean> {
  if (Array.isArray(address)) {
    const results = await Promise.all(address.map((adr) => postValidateSignature(adr, signature, message)));
    const anyValid = results.some((x) => x);
    return anyValid
  } else {
    const apiResult = await postValidateSignature(address, signature, message);
    return apiResult
  }
}
