import express from 'express';
import { TransactionInformation } from '../types';

export function getTransactionInfo(req: express.Request, res: express.Response) {
  const { reference } = req.query;
  if (!reference) {
    return res.status(400).send('Reference missing');
  }
  const result: TransactionInformation = {
    status: 'ACCEPTED',
    receivedAmount: '100',
  };
  return res.json(result);
}
