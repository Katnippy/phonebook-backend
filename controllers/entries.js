import express from 'express';

import Entry from '../models/entry.js';

// ? One liner?
const entriesRouter = express.Router();
// POST
entriesRouter.post('/', async (request, response) => {
  const body = request.body;
  const entry = new Entry({
    name: body.name,
    number: body.number,
  });
  const savedEntry = await entry.save();
  response.status(201).json(savedEntry);
});

// GET
entriesRouter.get('/', async (request, response) => {
  const entries = await Entry.find({});
  response.json(entries);
});

entriesRouter.get('/info', async (request, response) => {
  const entries = await Entry.find({});

  return (
    response.json({ entries: entries.length, date: Date() })
  );
});

entriesRouter.get('/:id', async (request, response) => {
  const entry = await Entry.findById(request.params.id);
  if (entry) {
    response.json(entry);
  } else {
    response.status(404).end({
      error: 'Resource already deleted or doesn\'t exist'
    });
  }
});

// PUT
entriesRouter.put('/:id', async (request, response) => {
  const { name, number } = request.body;
  const updatedEntry = await Entry.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  );
  response.json(updatedEntry);
});

// DELETE
entriesRouter.delete('/:id', async (request, response) => {
  const result = await Entry.findByIdAndDelete(request.params.id);
  if (result) {
    response.status(204).end();
  } else {
    response.status(404).send({
      error: 'Resource already deleted or doesn\'t exist'
    });
  }
});

export default entriesRouter;
