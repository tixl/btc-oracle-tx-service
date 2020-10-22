import express from 'express';
import { FullServiceHandlers, AssetTransactionData } from './types';
import { BcoinHandlers, BlockcyperHandlers } from './implementations';
require('dotenv').config();

const app = express();
app.use(express.json());

let handlers: FullServiceHandlers;
switch (process.env.SOURCE) {
  case 'BCOIN': {
    console.log('USING BCOIN');
    // TODO: check if bcoin env vars are set
    handlers = BcoinHandlers;
    break;
  }
  case 'BLOCKCYPHER': {
    console.log('USING BLOCKCYPHER');
    // TODO: check if blockcypher env vars are set
    handlers = BlockcyperHandlers;
    break;
  }
  default:
    console.log('USING BCOIN');
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
  const { partialTx, signatures, publicKey, tosign } = req.body;
  if (!partialTx || !signatures || !publicKey || !tosign) {
    return res.status(400).send('Missing body');
  }
  const result = await handlers.transactionService.signAndSendTransaction(partialTx, tosign, signatures, publicKey);
  return res.json(result);
});

const port = process.env.PORT || 4000;
app.listen(port);
console.log(`Service listening on port ${port}`);
