import mongoose from 'mongoose';

if (process.argv.length < 3) {
  console.log('Please provide the database password as the 3rd argument.');
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://katnippy:${password}@cluster0.vphe07v.mongodb.net/phonebook?retryWrites=true&w=majority`;
mongoose.set('strictQuery',false);
mongoose.connect(url);

const entrySchema = new mongoose.Schema({
  name: String, 
  number: String,
});
const Entry = mongoose.model('Entry', entrySchema);

if (process.argv.length === 3) {
  console.log('Phonebook:');
  Entry.find({}).then((result) => {
    result.forEach((entry) => {
      console.log(`${entry.name} - ${entry.number}`);
    });
    mongoose.connection.close();
  });
} else {
  const entry = new Entry({
    name: process.argv[3],
    number: process.argv[4],
  });
  entry.save().then((result) => {
    console.log('Entry saved!');
    mongoose.connection.close();
  });
}
