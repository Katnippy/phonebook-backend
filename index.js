import express from 'express';
import morgan from 'morgan';
import chalk from 'chalk';

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
app.use(express.json());

morgan.token('body', (request) => JSON.stringify(request.body));
app.use(morgan((tokens, request, response) => {
  return [
    chalk.green.bold(tokens.method(request, response)),
    tokens.body(request) != '{}' ? tokens.body(request) : '',
    chalk.cyan(tokens.url(request, response)),
    chalk.yellow.bold(tokens.status(request, response)),
    tokens.res(request, response, 'content-length'), '-',
    'took', tokens['response-time'](request, response), 'ms'
  ].join(' ');
}));

// POST
function generateID() {
  const maxID = entries.length > 0 ? Math.max(...entries.map((e) => e.id)) : 0;

  return maxID + 1;
}

app.post('/api/entries', (request, response) => {
  const body = request.body;
  // ? Refactor?
  if (!body.name && !body.number) {
    return response.status(400).json({
      error: 'Name & number missing'
    });
  } else if (!body.name) {
    return response.status(400).json({
      error: 'Name missing'
    });
  } else if (!body.number) {
    return response.status(400).json({
      error: 'Number missing'
    });
  } else if (entries.some((entry) => entry.name === body.name)) {
    return response.status(409).json({
      error: 'Entry already exists with that name'
    });
  }

  const entry = {
    name: body.name,
    number: body.number,
    id: generateID()
  };
  entries = entries.concat(entry);
  response.json(entry);
  morgan()
});

// GET
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

// DELETE
app.delete('/api/entries/:id', (request, response) => {
  const id = Number(request.params.id);
  entries = entries.filter((entry) => entry.id != id);

  response.status(204).end();
});

// Run server.
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});