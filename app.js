import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import chalk from 'chalk';

import config from './utils/config.js';
import logger from './utils/logger.js';
import entriesRouter from './controllers/entries.js';
import middleware from './utils/middleware.js';

const app = express();

// Connect to DB.
mongoose.set('strictQuery', false);

const url = config.MONGODB_URI;
// Replaces password in URL with asterisks.
// ? Make function?
const firstIndex = url.indexOf(':', url.indexOf(':') + 1);
const secondIndex = url.indexOf('@');
const password = url.slice(firstIndex + 1, secondIndex);
const censoredUrl = url.replace(password, '********');
logger.info(`Connecting to ${censoredUrl}...`);

mongoose.connect(url)
  .then(() => logger.info('Connected to database.'))
  .catch((error) => logger.info(
    `Error connecting to database: ${error.message}`
  ));

// Initialise app.
app.use(express.static('dist'));
app.use(cors());
app.use(express.json());

morgan.token('body', (request) => JSON.stringify(request.body));
app.use(morgan((tokens, request, response) => {
  return [
    chalk.green.bold(tokens.method(request, response)),
    tokens.body(request) !== '{}' ? tokens.body(request) : '',
    chalk.cyan(tokens.url(request, response)),
    chalk.yellow.bold(tokens.status(request, response)),
    tokens.res(request, response, 'content-length'), '-',
    'took', tokens['response-time'](request, response), 'ms'
  ].join(' ');
}));

app.use('/api/entries', entriesRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
