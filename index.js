import app from './app.js';
import config from './utils/config.js';
import logger from './utils/logger.js';

// Run server.
app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
