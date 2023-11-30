import mongoose from 'mongoose';

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
