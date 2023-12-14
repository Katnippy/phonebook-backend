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

afterAll(async () => {
  await mongoose.connection.close();
});
