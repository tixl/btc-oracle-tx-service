import express from 'express';
import { FullServiceHandlers, AssetTransactionData } from './types';
import { BcoinHandlers } from './implementations';
require('dotenv').config();

const app = express();
app.use(express.json());

let handlers: FullServiceHandlers;
switch (process.env.SOURCE) {
  case 'BCOIN': {
    handlers = BcoinHandlers;
    break;
  }
  default:
    handlers = BcoinHandlers;
}

app.get('/oracle/transactionInfo', async (req, res) => {
  const { reference, poolAddress } = req.query;
  if (!reference || !poolAddress) return res.json({ status: 'ERROR' });
  const result = await handlers.oracle.getTransactionInformation(reference as string, poolAddress as string);
  return res.json(result);
});

app.post('/oracle/validateSignature', async (req, res) => {
  const { message, address, signature } = req.body;
  if (!message || !address || !signature) {
    return res.status(400).send('Missing body');
  }
  const result = await handlers.oracle.validateSignature(message, address, signature);
  return res.json(result);
});

app.post('/tx/create', async (req, res) => {
  const { transactionData } = req.body;
  if (!transactionData) {
    return res.status(400).send('Missing parameters');
  }
  const result = await handlers.transactionService.createTransaction(transactionData as AssetTransactionData[]);
  return res.json(result);
});

app.post('/tx/signAndSend', async (req, res) => {
  const { partialTx, signatures } = req.body;
  if (!partialTx || !signatures) {
    return res.status(400).send('Missing body');
  }
  const result = await handlers.transactionService.signAndSendTransaction(partialTx, signatures);
  return res.json(result);
});

const port = process.env.PORT || 4000;
app.listen(port);
console.log(`Service listening on port ${port}`);
