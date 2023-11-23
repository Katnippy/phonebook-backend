import express from 'express';

let entries = [
  {
    "name": "Pingu",
    "number": "02086876000",
    "id": 1
  },
  {
    "name": "Piplup",
    "number": "07066775792",
    "id": 2
  },
  {
    "name": "Wheezy",
    "number": "07830494624",
    "id": 3
  },
  {
    "name": "Tuxedosam",
    "number": "07750295291",
    "id": 4
  },
  {
    "name": "Tux",
    "number": "07027167775",
    "id": 5
  },
  {
    "name": "Pinga",
    "number": "07034452515",
    "id": 6
  },
  {
    "name": "Eiscue",
    "number": "07850490004",
    "id": 7
  }
];

const app = express();

app.get('/', (request, response) => {
  response.send('<h1>Hello, world!</h1>');
});

app.get('/api/entries', (request, response) => {
  response.json(entries);
});

app.get('/info', (request, response) => {
  const date = new Date();
  response.send(`
    <p>Phonebook has info for ${entries.length} people</p>
    <p>${date}</p>
  `);
});

app.get('/api/entries/:id', (request, response) => {
  const id = Number(request.params.id);
  const entry = entries.find((entry) => entry.id === id);
  if (entry) {
    response.json(entry);
  } else {
    response.status(404).end();
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});