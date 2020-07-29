export interface TransactionInformation {
    status: 'ACCEPTED' | 'PENDING' | 'NOT_ACCEPTED';
    // We should always use the smallest possible unit for amounts
    receivedAmount: string;
  }
  
  export interface OracleInterface {
    assetSymbol: string;
    // txReference is the information passed with the deposit block. For BTC it is the transaction hash
    getTransactionInformation: (txReference: string) => Promise<TransactionInformation>;
  }
  
  export type PartialTransaction = {
    toSign: string[];
  } & any;
  
  export type SignAndSendStatus = 'OK' | 'INVALID_SIGNATURES' | 'ERROR' | 'ALREADY_KNOWN';
  export type CreateTransactionStatus =
    | 'OK'
    | 'INSUFFICIENT_FUNDS'
    | 'INVALID_RECEIVER_ADDRESS'
    | 'INVALID_SENDER_ADDRESS'
    | 'ERROR';
  
  export interface TransactionServiceInterface {
    assetSymbol: string;
    // Creates a transaction skeleton with the strings that have to be signed
    createTransaction: (
      fromAddress: string,
      toAddress: string,
      amount: string,
    ) => Promise<{ status: CreateTransactionStatus; partialTx?: PartialTransaction }>;
    // Sends the partial transaction back with signatures and returns a status
    signAndSendTransaction: (partialTx: PartialTransaction, signatures: string[]) => Promise<SignAndSendStatus>;
  }
  