import express from 'express';
import { SignAndSendStatus } from '../types';

export function signAndSendTransaction(req: express.Request, res: express.Response) {
  const { partialTx, signatures } = req.body;
  if (!partialTx || !signatures) {
    return res.status(400).send('Missing body');
  }
  const result: SignAndSendStatus = 'OK';
  return res.json(result);
}
