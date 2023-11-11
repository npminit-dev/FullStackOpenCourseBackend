import express, { json } from "express";
import morgan from "morgan";
import { persons as p } from "./persons.js";
import cors from 'cors'

let persons = [...p];

const app = express();

app.use(morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    'POST body: ' + (JSON.stringify(req.body))
  ].join(' - ')
}, { immediate: false }));
app.use(json());
app.use(cors())

app.get('/info', (req, res) => {
  res.statusMessage = 'Correct!';
  res.status(200).send(new Date().toString());
})

app.get('/api/persons', (req, res) => {
  res.statusMessage = 'Correct!';
  res.status(200).send(persons);
})

app.get('/api/persons/:id', (req, res) => {
  let person = persons.find(person => person.id.toString() === req.params.id);
  if(person) res.status(200).send(person);
  else res.status(404);
})

app.delete('/api/persons', (req, res) => {
  console.log('body: ', req.body)
  let data = req.body;
  if(data && data.id) {
    let prevLength = persons.length;
    persons = persons.filter(person => person.id != data.id);
    if(prevLength === persons.length + 1) res.status(200).send(persons);
    else res.status(400).send('Incorrect ID!');
  } else res.status(404).send('No body or incorrect body!');
})

app.post('/api/persons', (req, res) => {
  let data = req.body;
  if(data) {
    if(!data.name || !data.number) return res.status(400).send('Missing properties!');
    if(persons.find(person => data.name === person.name)) return res.status(400).send('Name already exists')
    let newPerson = { id: Math.round(Math.random() * 1000000), ...data }
    persons.push(newPerson);
    return res.status(200).json(newPerson);
  } else res.status(400).send('No body!');
})

app.listen(process.env.PORT || 3001, () => console.log('Server listening at port 3001'))


