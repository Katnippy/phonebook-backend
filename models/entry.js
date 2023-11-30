import mongoose from 'mongoose';

import config from './../utils/config.js';
import logger from './../utils/logger.js';

mongoose.set('strictQuery', false);

const url = config.MONGODB_URI;
// Replaces password in URL with asterisks.
// ? Make function?
const firstIndex = url.indexOf(':', url.indexOf(':') + 1);
const secondIndex = url.indexOf('@');
const password = url.slice(firstIndex + 1, secondIndex);
const censoredUrl = url.replace(password, '********');
logger.info(`Connecting to ${censoredUrl}...`);

mongoose.connect(url)
  .then(() => logger.info('Connected to database.'))
  .catch((error) => logger.info(
    `Error connecting to database: ${error.message}`
  ));

const entrySchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 2,
    required: [true, 'Name and number are both required.']
  },
  number: {
    type: String,
    validate: {
      validator: function(v) {
        return /^0\d{9,10}$/.test(v);
      },
      message: (props) => `${props.value} isn't a valid UK phone number.`
    },
    required: [true, 'Name and number are both required.']
  },
});
entrySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});
const Entry = mongoose.model('Entry', entrySchema);

export default Entry;
