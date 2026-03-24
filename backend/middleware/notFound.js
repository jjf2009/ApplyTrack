const StatusCodes = require('http-status-codes');
const AppError = require('../utils/AppError');

const notFound = (req,_res,next) => {
    next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, StatusCodes.NOT_FOUND));
}

module.exports = notFound;