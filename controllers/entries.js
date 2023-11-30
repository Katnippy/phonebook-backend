import express from 'express';

import Entry from '../models/entry.js';

// ? One liner?
const entriesRouter = express.Router();
// POST
entriesRouter.post('/', (request, response, next) => {
  const body = request.body;
  const entry = new Entry({
    name: body.name,
    number: body.number,
  });
  entry.save()
    .then((savedEntry) => response.json(savedEntry))
    .catch((error) => next(error));
});

// GET
// ! Won't work.
// app.get('/', (request, response) => {
//   response.send('<h1>Hello, world!</h1>');
// });

entriesRouter.get('/', (request, response) => {
  Entry.find({}).then((entries) => response.json(entries));
});

// TODO: Make this a JSON response instead.
// ! Won't work.
// app.get('/info', (request, response) => {
//   Entry.find({}).then((entries) => {
//     return (
//       response.send(`
//         <p>Phonebook has info for ${entries.length} people</p>
//         <p>${Date()}</p>
//     `));
//   });
// });

entriesRouter.get('/:id', (request, response, next) => {
  Entry.findById(request.params.id)
    .then((entry) => {
      if (entry) {
        response.json(entry);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

// PUT
entriesRouter.put('/:id', (request, response, next) => {
  const { name, number } = request.body;
  Entry.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then((updatedEntry) => response.json(updatedEntry))
    .catch((error) => next(error));
});

// DELETE
entriesRouter.delete('/:id', (request, response, next) => {
  Entry.findByIdAndDelete(request.params.id)
    .then((result) => {
      if (result) {
        response.status(204).end();
      } else {
        response.status(404).send({
          error: 'Resource already deleted or doesn\'t exist'
        });
      }
    })
    .catch((error) => next(error));
});

export default entriesRouter;
