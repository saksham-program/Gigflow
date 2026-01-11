export function notFound(req, res, next) {
  res.status(404).json({ message: 'Not Found' });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  const message = err.message || 'Server Error';
  res.status(status).json({ message });
}
