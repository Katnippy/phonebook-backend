import app from '../app.js';
import supertest from 'supertest';
import mongoose from 'mongoose';

const api = supertest(app);

test('Entries are returned as JSON', async () => {
  await api
    .get('/api/entries')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('There are 2 entries', async () => {
  const response = await api.get('/api/entries');

  expect(response.body).toHaveLength(2);
});

test('The first entry is Pingu\'s', async () => {
  const response = await api.get('/api/entries');

  expect(response.body[0].name).toBe('Pingu');
});

afterAll(async () => {
  await mongoose.connection.close();
});
