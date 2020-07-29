import express from 'express';
import { getTransactionInfo } from './handlers/getTransactionInfo';
import { createTransaction } from './handlers/createTransaction';
import { signAndSendTransaction } from './handlers/signAndSendTransaction';
require('dotenv').config();

const app = express();
app.use(express.json());

app.get('/oracle/transactionInfo', getTransactionInfo);
app.get('/tx/create', createTransaction);
app.post('/tx/signAndSend', signAndSendTransaction);

const port = process.env.PORT || 4000
app.listen(port);
console.log(`Service listening on port ${port}`)