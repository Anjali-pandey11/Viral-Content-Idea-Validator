const errorHandler = (err, req, res, next) => {
  // Default status code
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Mongoose Bad ObjectId Error
  if (err.name === 'CastError') {
    statusCode = 404;
    message = 'Resource not found';
  }

  // Mongoose Duplicate Key Error during race condition 
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired, please login again';
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
};

export default errorHandler;