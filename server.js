'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const config = require('./config.json');

const mongoose = require('mongoose');
mongoose.plugin((schema) => { schema.options.usePushEach = true; });
mongoose.Promise = global.Promise;

mongoose.connect(config.mongo.database_host, config.mongo.options);
mongoose.connection.on('error', (error) => {
        logger.error('MongoDB connection error', error);
        process.exit(1);
    }
);

const {logger, errorHandler, jwt} = require('./helpers');

const { login, register } = require('./api/user');

const app = express();

// configure app
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({type: 'application/json'}));
app.use(cors());

// use JWT auth to secure the api
app.use(jwt());

// api routes
app.post('/login', login);
app.post('/register', register);


// global error handler
app.use(errorHandler);

const port = config.port || 3000;
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