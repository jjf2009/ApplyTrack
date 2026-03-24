const StatusCodes = require('http-status-codes');
const AppError = require('../utils/AppError');

const handleMongooseErrors = (err) => {
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return new AppError(`${field} already exists`, StatusCodes.CONFLICT);
  }
   if(err.name == "ValidationError"){
    const messages = Object.keys(err.errors).map((e)=>e.message).join(',');
    return new AppError(messages, StatusCodes.UNPROCESSABLE_ENTITY);
   }
   
    if (err.name === "CastError") {
      return new AppError(
        `Invalid ${err.path}: ${err.value}`,
        StatusCodes.BAD_REQUEST,
      );
    }
  
    return err;
}


const errorHandler = (err, req, res, _next) => {
  let error = err;

  if (!err.isOperational) {
    error = handleMongooseErrors(err);
  }

  const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = error.isOperational
    ? error.message
    : 'Something went wrong. Please try again later.';


  const response = {
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  console.error(`[${statusCode}] ${err.message}`);
  res.status(statusCode).json(response);
};

module.exports = errorHandler;
