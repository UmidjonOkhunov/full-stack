require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const app = express();
app.use(express.json());
app.use(express.static("build"));
// app.use(logger);
const Person = require("./models/person");

morgan.token("body", function getId(res) {
  return JSON.stringify(res.body);
});

app.use(morgan(":method :url :status :response-time ms - :body"));

const cors = require("cors");
// const { default: notes } = require("../fronend/src/services/notes");
app.use(cors());

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((res) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((response) => {
      res.json(response);
    })
    .catch((error) => next(error));
});

app.get("/info", (req, res) => {
  res.json({ people: persons.length, date: new Date() });
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number is missing",
    });
  }

  Person.find({ name: body.name }).then((person) => {
    if (person.name) {
      return response.status(400).json({
        error: "Name already exists in the phonebook",
      });
    }
  });

  const person = new Person({
    name: body.name,
    number: body.number,
    date: new Date(),
  });

  person
    .save()
    .then((personSaved) => {
      response.json(personSaved);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
