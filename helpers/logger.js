const Logger = require('winston');
const { combine, printf } = Logger.format;

const logFormat = printf(info => {
  return `${info.timestamp} [${info.level}]: ${info.message}`;
});

// instantiate a new Winston Logger
module.exports = Logger.createLogger({
  format: Logger.format.combine(Logger.format.timestamp(), Logger.format.json()),
  transports: [
    new Logger.transports.Console({
      format: combine(Logger.format.colorize(), logFormat)
    })
  ],
  exitOnError: false // do not exit on handled exceptions
});