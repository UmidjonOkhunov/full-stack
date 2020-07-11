const express = require("express");
const morgan = require("morgan");
const app = express();
app.use(express.json());
app.use(express.static("build"));
// app.use(logger);

morgan.token("body", function getId(res) {
  return JSON.stringify(res.body);
});

app.use(morgan(":method :url :status :response-time ms - :body"));

let persons = [
  {
    id: 1,
    name: "HTML is easy",
    date: "2019-05-30T17:30:31.098Z",
    number: 2141235,
    important: true,
  },
  {
    id: 2,
    name: "Browser can execute only Javascript",
    date: "2019-05-30T18:39:34.091Z",
    number: 2141235,
    important: false,
  },
  {
    id: 3,
    name: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    number: 2141235,
    important: true,
  },
];
const cors = require("cors");
app.use(cors());

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  res.json({ people: persons.length, date: new Date() });
});

const generateId = () => {
  return Math.random(10 ^ 5);
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number is missing",
    });
  }

  const temp = persons.find((person) => person.name === body.name);
  if (temp) {
    return response.status(400).json({
      error: "Name already exists in the phonebook",
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    date: new Date(),
    id: generateId(),
  };

  persons = persons.concat(person);

  response.json(person);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
