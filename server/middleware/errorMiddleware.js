const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
};

const errorHandler = (err, _req, res, _next) => {
  let message = err.message || "Server error";
  let statusCode =
    res.statusCode && res.statusCode !== 200 ? res.statusCode : err.statusCode || 500;

  if (err.name === "MulterError" && err.code === "LIMIT_FILE_SIZE") {
    statusCode = 400;
    message = "Image must be 5MB or smaller";
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = { errorHandler, notFound };
