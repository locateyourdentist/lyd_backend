// const winston = require('winston');
// const path = require('path');

// // Common format
// const logFormat = winston.format.printf(
//   ({ level, message, timestamp }) => {
//     return `${timestamp} [${level.toUpperCase()}]: ${message}`;
//   }
// );

// // Error Logger
// const errorLogger = winston.createLogger({
//   level: 'error',
//   format: winston.format.combine(
//     winston.format.timestamp(),
//     logFormat
//   ),
//   transports: [
//     new winston.transports.File({ filename: path.join(__dirname, 'logs', 'error.log') })
//   ],
// });

// // Success Logger
// const successLogger = winston.createLogger({
//   level: 'info',
//   format: winston.format.combine(
//     winston.format.timestamp(),
//     logFormat
//   ),
//   transports: [
//     new winston.transports.File({ filename: path.join(__dirname, 'logs', 'success.log') })
//   ],
// });

// module.exports = { errorLogger, successLogger };
const winston = require('winston');
const path = require('path');
const fs = require('fs');

// ✅ Create logs directory automatically
const logDir = path.join(__dirname, 'logs');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}


const logFormat = winston.format.printf(
  ({ level, message, timestamp }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
  }
);

// Timestamp
const timestampFormat = winston.format.timestamp({
  format: 'YYYY-MM-DD HH:mm:ss'
});

// Error Logger
const errorLogger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    timestampFormat,
    logFormat
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, 'error.log')
    })
  ],
});

// Success Logger
const successLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    timestampFormat,
    logFormat
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, 'success.log')
    })
  ],
});

module.exports = { errorLogger, successLogger };