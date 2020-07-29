import express from 'express';
import { CreateTransactionStatus, PartialTransaction } from '../types';

export function createTransaction(req: express.Request, res: express.Response) {
  const { fromAddress, toAddress, amount } = req.query;
  if (!fromAddress || !toAddress || !amount) {
    return res.status(400).send('Missing parameters');
  }
  const result: { status: CreateTransactionStatus; partialTx: PartialTransaction } = {
    status: 'OK',
    partialTx: {
      some: 'field',
      toSign: ['signthis', 'andalsothis'],
    },
  };
  return res.json(result);
}
