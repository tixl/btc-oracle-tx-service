import express from 'express';
import { FullServiceHandlers, AssetTransactionData, TransactionInformation } from './types';
import { BcoinHandlers, BlockcyperHandlers } from './implementations';
import { configureLogger, logger } from './log';
import NodeCache from 'node-cache';
require('dotenv').config();

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'local_with_logger') {
  configureLogger(
    process.env.APEX_URL,
    process.env.APEX_AUTH,
    process.env.APEX_PROJECT,
    process.env.NET,
    process.env.SERVICE,
  );
}

const app = express();
app.use(express.json());

let handlers: FullServiceHandlers;
switch (process.env.SOURCE) {
  case 'BCOIN': {
    logger.info('USING BCOIN');
    // TODO: check if bcoin env vars are set
    handlers = BcoinHandlers;
    break;
  }
  case 'BLOCKCYPHER': {
    logger.info('USING BLOCKCYPHER');
    const token = process.env.BLOCKCYPHER_TOKEN;
    if (!token || token === '') {
      throw 'Missing Blockcypher token';
    }
    // TODO: check if blockcypher env vars are set
    handlers = BlockcyperHandlers;
    break;
  }
  default:
    logger.info('USING BCOIN');
    handlers = BcoinHandlers;
}

const txInfoCache = new NodeCache({ stdTTL: 10, checkperiod: 1 });
app.get('/oracle/transactionInfo', async (req, res) => {
  const { reference, poolAddress } = req.query;
  logger.info('Called /oracle/transactionInfo', { reference, poolAddress });
  if (!reference || !poolAddress) return res.status(400).json({ status: 'MISSING_PARAMS' });
  const key = `${reference}-${poolAddress}`;
  const fromCache: TransactionInformation | undefined = txInfoCache.get(key);
  if (fromCache) {
    logger.info('delivering from cache', { key });
    return res.json(fromCache);
  } else {
    logger.info('no cache hit', { key });
    const result = await handlers.oracle.getTransactionInformation(reference as string, poolAddress as string);
    txInfoCache.set(key, result);
    return res.json(result);
  }
});

app.post('/oracle/validateSignature', async (req, res) => {
  const { message, address, signature } = req.body;
  logger.info('Called /oracle/validateSignature', { msg: message, address, signature });
  if (!message || !address || !signature) {
    return res.status(400).json({ status: 'MISSING_BODY' });
  }
  const result = await handlers.oracle.validateSignature(message, address, signature);
  return res.json(result);
});

app.post('/tx/create', async (req, res) => {
  const { transactionData } = req.body;
  logger.info('Called /tx/create');
  if (!transactionData) {
    return res.status(400).json({ status: 'MISSING_BODY' });
  }
  const result = await handlers.transactionService.createTransaction(transactionData as AssetTransactionData[]);
  switch (result.status) {
    case 'OK':
      return res.json(result);
    case 'INSUFFICIENT_FUNDS':
      return res.status(400).json({ status: result.status });
    case 'INVALID_RECEIVER_ADDRESS':
      return res.status(400).json({ status: result.status });
    case 'INVALID_SENDER_ADDRESS':
      return res.status(400).json({ status: result.status });
    default:
      return res.status(500).json({ status: result.status });
  }
});

app.post('/tx/signAndSend', async (req, res) => {
  const { partialTx, signatures, publicKey, tosign } = req.body;
  logger.info('Called /tx/signAndSend');
  if (!partialTx || !signatures || !publicKey || !tosign) {
    return res.status(400).json({ status: 'MISSING_BODY' });
  }
  const result = await handlers.transactionService.signAndSendTransaction(partialTx, tosign, signatures, publicKey);
  switch (result.status) {
    case 'OK':
      return res.json(result);
    case 'ALREADY_KNOWN':
      return res.status(200).json(result);
    case 'INVALID_SIGNATURES':
      return res.status(400).json({ status: result.status });
    default:
      return res.status(500).json({ status: result.status });
  }
});

const port = process.env.PORT || 4000;
app.listen(port);
logger.info(`Service listening on port ${port}`);
