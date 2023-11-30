import logger from './logger.js';

// Unknown endpoint handler
function unknownEndpoint(request, response) {
  return response.status(404).send({ error: 'Unknown endpoint' });
}

// Error handler
function errorHandler(error, request, response, next) {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Malformatted ID' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message });
  } else {
    next(error);
  }
}

export default { unknownEndpoint, errorHandler };
