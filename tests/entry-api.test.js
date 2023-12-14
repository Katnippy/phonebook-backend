import app from '../app.js';
import supertest from 'supertest';
import mongoose from 'mongoose';

import Entry from '../models/entry.js';

const api = supertest(app);

const initialEntries = [
  { name: 'Pingu', number: '07822850998' },
  { name: 'Pinga', number: '07705362453' },
];

beforeEach(async () => {
  await Entry.deleteMany({});
  let entryObject = new Entry(initialEntries[0]);
  await entryObject.save();
  entryObject = new Entry(initialEntries[1]);
  await entryObject.save();
});

test('Entries are returned as JSON', async () => {
  await api
    .get('/api/entries')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('There are 2 entries', async () => {
  const response = await api.get('/api/entries');

  expect(response.body).toHaveLength(initialEntries.length);
});

test('The first entry is Pingu\'s', async () => {
  const response = await api.get('/api/entries');
  const contents = response.body.map((r) => r.name);

  expect(contents).toContain('Pingu');
});

afterAll(async () => {
  await mongoose.connection.close();
});
