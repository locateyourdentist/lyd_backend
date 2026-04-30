const { successLogger, errorLogger } = require("../logger_error/logger");
const ErrorLog = require('../model/error_model'); 

module.exports = (req, res, next) => {
  const oldSend = res.send;

  res.send = async function (body) {
    let responseBody;
    try {
      responseBody = typeof body === "string" ? JSON.parse(body) : body;
    } catch {
      responseBody = body;
    }

    const responseStatus = responseBody?.status || null;
    const responseMessage = responseBody?.message || null;

    const logData = {
      method: req.method,
      userId: req.user?.userId || null,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseStatus,
      responseMessage,
      ip: req.ip,
    };

    try {
      if (responseStatus === "error") {
        await ErrorLog.create({
              userId: req.user?.userId || null,
          message: responseMessage || "No message",
          responseStatus: responseStatus || "error",
          statusCode: res.statusCode,
          method: req.method,
          url: req.originalUrl,
          body: req.body || {},
          ip: req.ip,
        });

        errorLogger.error(JSON.stringify(logData));
      } else {
        successLogger.info(JSON.stringify(logData));
      }
    } catch (err) {
      console.error("Logging failed:", err.message);
    }

    return oldSend.apply(res, arguments);
  };

  next();
};