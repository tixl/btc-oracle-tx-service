import { CreateTransactionStatus, AssetTransactionData } from '../../../../types';
import { getTosigns } from '../../lib/getTosigns';
import { estimateFee } from '../../api/estimateFee';
import { createTransaction as apiCreateTransaction } from '../../api/createTransaction';

export async function createTransaction(
  transactionData: AssetTransactionData[],
): Promise<{ status: CreateTransactionStatus; partialTx?: object; tosign?: string[] }> {
  const poolAddress = process.env.POOL_ADDRESS;
  if (!poolAddress) {
    console.log('Missing pool address');
    return { status: 'ERROR' };
  }
  if (transactionData.map((x) => x.fromAddress).some((x) => x !== poolAddress)) {
    return { status: 'INVALID_SENDER_ADDRESS' };
  }
  const targetOutputs = new Map<string, boolean>();
  transactionData.forEach((x) => targetOutputs.set(x.toAddress, true));
  try {
    const rate = await estimateFee();
    if (rate === null) {
      console.log('Unable to estimate fee');
      return { status: 'ERROR' };
    }
    const outputs = transactionData.map((x) => ({ address: x.toAddress, value: Number(x.amount) - 500 }));
    const estimateTx = await apiCreateTransaction({
      rate,
      outputs,
      sign: false,
      subtractFee: false,
      selection: 'value',
    });
    if (!estimateTx.tx) {
      return { status: 'ERROR' };
    }
    //TODO: remove fees
    console.log('estimate tx', estimateTx);
    const fee = estimateTx.tx.fee;
    const maxFee = Math.ceil(fee * 1.85);

    // Shared fee to all payouts
    const feePerOutput = Math.ceil(maxFee / outputs.length);

    function isChangeAddress(adr: string) {
      return !targetOutputs.has(adr);
    }

    const amountChangeAddresses = estimateTx.tx.outputs.filter((o: any) => isChangeAddress(o.address)).length;
    const feeBackPerChangeAddress = Math.floor(fee / amountChangeAddresses);
    console.log({ feeBackPerChangeAddress, feePerOutput });
    const newOutputs = estimateTx.tx.outputs
      // remove outputs that can't pay the fee
      .filter((o: any) => {
        if (isChangeAddress(o.address)) {
          return true;
        } else {
          return o.value > feePerOutput;
        }
      })
      .map((o: any) => {
        if (isChangeAddress(o.address)) {
          // is a change address
          return { address: poolAddress, value: Number(o.value) - 200 };
        } else {
          // is not a change address

          return { address: o.address, value: o.value };
        }
      });
    console.log('new outputs', newOutputs);

    // const safeFee = Math.ceil(1.5 * estimatedFee);
    console.log({ maxFee });
    const res = await apiCreateTransaction({
      rate,
      maxFee,
      outputs: newOutputs,
      sign: false,
      subtractFee: false,
      selection: 'value',
    });
    if (res.error) {
      if (res.error.error?.type == 'FundingError') {
        return { status: 'INSUFFICIENT_FUNDS' };
      }
      return { status: 'ERROR' };
    } else {
      const tosign = await getTosigns(res.tx);
      if (res.tx) {
        return { status: 'OK', partialTx: res.tx, tosign };
      }
      return { status: 'ERROR' };
    }
  } catch (error) {
    console.log(error);
    return { status: 'ERROR' };
  }
}
