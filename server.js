'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const {logger} = require('./helpers');

const { login } = require('./api/user');

const app = express();

// configure app
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({type: 'application/json'}));

// routes
app.post('/login', login);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    logger.info(`Starting Watchtower on  port ${port}`);
});

process.on('unhandledRejection', (reason) => {
    throw reason;
});

process.on('uncaughtException', error => {
    logger.error(`Uncaught Exception: ${500} - ${error.message}, Stack: ${error.stack}`);
});

process.on('SIGINT', () => {
    logger.info(' Alright! Bye bye!');
    process.exit();
});