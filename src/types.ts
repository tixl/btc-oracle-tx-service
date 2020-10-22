export interface OracleHandlers {
  getTransactionInformation: (txReference: string, poolAddress: string) => Promise<TransactionInformation>;
  validateSignature: (message: string, address: string[], signature: string) => Promise<boolean>;
}

export interface TransactionServiceHandlers {
  createTransaction: (
    transactionData: AssetTransactionData[],
  ) => Promise<{ status: CreateTransactionStatus; partialTx?: PartialTransaction; tosign?: string[] }>;
  signAndSendTransaction: (partialTx: object, tosign: string[], signatures: string[], publicKey: string) => Promise<SignAndSendResponse>;
}

export type FullServiceHandlers = {
  oracle: OracleHandlers;
  transactionService: TransactionServiceHandlers;
};

export interface TransactionInformation {
  status: 'ACCEPTED' | 'PENDING' | 'NOT_ACCEPTED' | 'ERROR';
  // We should always use the smallest possible unit for amounts
  receivedAmount?: string;
  sender?: string[];
}

export interface OracleInterface {
  assetSymbol: string;
  // txReference is the information passed with the deposit block. For BTC it is the transaction hash
  getTransactionInformation: (txReference: string, poolAddress: string) => Promise<TransactionInformation>;
  validateSignature: (message: string, address: string, signature: string) => Promise<boolean>;
}

export type PartialTransaction = {
  toSign: string[];
  hex: string;
} & any;

export type FullTransaction = object;

export type SignAndSendStatus = 'OK' | 'INVALID_SIGNATURES' | 'ERROR' | 'ALREADY_KNOWN';
export type CreateTransactionStatus =
  | 'OK'
  | 'INSUFFICIENT_FUNDS'
  | 'INVALID_RECEIVER_ADDRESS'
  | 'INVALID_SENDER_ADDRESS'
  | 'ERROR';

export interface AssetTransactionData {
  fromAddress: string;
  toAddress: string;
  amount: string;
}

export interface SignAndSendResponse {
  status: SignAndSendStatus;
  hash?: string;
}

export interface TransactionServiceInterface {
  assetSymbol: string;
  // Creates a transaction skeleton with the strings that have to be signed
  createTransaction: (
    transactionData: AssetTransactionData[],
  ) => Promise<{ status: CreateTransactionStatus; partialTx?: PartialTransaction; tosign?: string[] }>;
  // Sends the partial transaction back with signatures and returns a status
  signAndSendTransaction: (partialTx: object, tosign: string[], signatures: string[], publicKey: string) => Promise<SignAndSendResponse>;
}

export type GenerateSignatureStatus = 'OK' | 'OTHER_PART_FAILED' | 'NOT_ENOUGH_PARTICIPANTS' | 'ERROR';
export type InitializeStatus = 'OK' | 'ERROR';
export type GetAddressStatus = 'OK' | 'NO_GENERATION' | 'ERROR';

export interface SignaturePeer {
  id: string;
  moniker: string;
  short: string;
  multiAddr: string;
}

export interface SignatureGenerationInterface {
  assetSymbol: string;
  peers: SignaturePeer[];
  threshold: number;
  generateSignature: (
    toSign: string[],
  ) => Promise<{ status: GenerateSignatureStatus; signatures?: string[]; publicKey?: string }>;
  getAddress: () => Promise<{ status: GetAddressStatus; address?: string }>;
  initialize: (id: string, moniker: string, short: string) => Promise<InitializeStatus>;
}
