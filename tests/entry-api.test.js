import app from '../app.js';
import supertest from 'supertest';
import mongoose from 'mongoose';

import Entry from '../models/entry.js';
import helper from './test-helper.js';

const api = supertest(app);

beforeEach(async () => {
  await Entry.deleteMany({});
  let entryObject = new Entry(helper.initialEntries[0]);
  await entryObject.save();
  entryObject = new Entry(helper.initialEntries[1]);
  await entryObject.save();
});

// POST
describe('POST', () => {
  test('A valid entry can be added', async () => {
    const newEntry = { name: 'Piplup', number: '07784495747' };
    await api
      .post('/api/entries')
      .send(newEntry)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const entriesAtEnd = await helper.jsonEntriesInDb();
    expect(entriesAtEnd).toHaveLength(helper.initialEntries.length + 1);

    const contents = entriesAtEnd.map((e) => e.name);
    expect(contents).toContain('Piplup');
  });

  test('An entry without a name won\'t be added', async () => {
    const newEntry = { number: '07053245899' };
    await api
      .post('/api/entries')
      .send(newEntry)
      .expect(400);

    const entriesAtEnd = await helper.jsonEntriesInDb();
    expect(entriesAtEnd).toHaveLength(helper.initialEntries.length);
  });

  test('An entry without a number won\'t be added', async () => {
    const newEntry = { name: 'Mumble' };
    await api
      .post('/api/entries')
      .send(newEntry)
      .expect(400);

    const entriesAtEnd = await helper.jsonEntriesInDb();
    expect(entriesAtEnd).toHaveLength(helper.initialEntries.length);
  });

  test('An empty entry won\'t be added', async () => {
    const newEntry = { };
    await api
      .post('/api/entries')
      .send(newEntry)
      .expect(400);

    const entriesAtEnd = await helper.jsonEntriesInDb();
    expect(entriesAtEnd).toHaveLength(helper.initialEntries.length);
  });
});

// GET
describe('GET', () => {
  test('Entries are returned as JSON', async () => {
    await api
      .get('/api/entries')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('There are 2 entries', async () => {
    const response = await api.get('/api/entries');

    expect(response.body).toHaveLength(helper.initialEntries.length);
  });

  test('The first entry is Pingu\'s', async () => {
    const response = await api.get('/api/entries');
    const contents = response.body.map((r) => r.name);

    expect(contents).toContain('Pingu');
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
