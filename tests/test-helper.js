import Entry from '../models/entry.js';

const initialEntries = [
  { name: 'Pingu', number: '07822850998' },
  { name: 'Pinga', number: '07705362453' },
];

async function jsonEntriesInDb() {
  const entries = await Entry.find({});

  return entries.map((entry) => entry.toJSON());
}

export default { initialEntries, jsonEntriesInDb };
