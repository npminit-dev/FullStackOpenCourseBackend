import express, { json } from "express";
import morgan from "morgan";
// import { persons as p } from "./persons.js";
import cors from 'cors'
import 'dotenv/config'
import personModel from "./mongodb.js";
import { color } from "console-log-colors";

// let persons = [...p];

const app = express();

app.use(morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    'POST body: ' + (JSON.stringify(req.body))
  ].join(' - ')
}));

app.use(json());
app.use(cors())
app.use(express.static('build'))

app.get('/info', (req, res) => {
  res.statusMessage = 'Correct!';
  res.status(200).send(new Date().toString());
})

app.get('/api/persons', (req, res, next) => {
  personModel.find({})
    .then(persons => res.status(200).send(persons))
    .catch(err => res.send({ error: err }))
})

app.get('/api/persons/:id', (req, res, next) => {
  personModel.findById(req.params.id)
    .then((person) => res.status(200).send(person))
    .catch(err => next({ error: err }))
})

app.delete('/api/persons', (req, res, next) => {
  console.log('body: ', req.body)
  let data = req.body;
  personModel.findByIdAndDelete(data.id)
    .then(result => {
      if(!result) next({ error: 'ID not found!' })
      res.status(200).send(result)
    })
    .catch(err => next({ error: err }))
})

app.post('/api/persons', (req, res, next) => {
  let data = req.body;
  if(data) {
    if(!data.name || !data.number) next({ error: 'Incorrect body syntax!' });
    let newPerson = new personModel({ name: data.name, number: data.number })
    newPerson.save()
      .then(result => res.status(200).send(result))
      .catch(err => next({ error: err }))
  } else next({ error: 'Missing body!' })
})

app.put('/api/persons', (req, res, next) => {
  let data = req.body;
  if(data) {
    if(!data.id || !data.newnumber) next({ error: 'Incorrect body syntax!' })
    personModel.findByIdAndUpdate(data.id, { number: data.newnumber }, { returnDocument: 'after' })
    .then(response => res.status(200).send(response))
    .catch(err => next({ error: err }))
  } else next({ error: 'Missing body!' })
})

const unknown = (req, res) => {
  res.status(404).send({ error: 'unkown endpoint' })
}

app.use(unknown)

app.use((err, req, res, next) => {
  if(err) {
    let errdata = `ERROR: METHOD: ${req.method} / URL: ${req.url} / MESSAGE: ${err.error}`
    console.log(color.red(errdata))
    switch(err) {
      case err.error === 'Incorrect body syntax!':
      case err.error === 'Missing body!':
        res.status(400).send(errdata)
        break;
      case err.error === 'ID not found!':
      default:
         res.status(404).send(errdata)
    }
  }
})

app.listen(process.env.PORT || 3001, () => console.log('Server listening at port ' + process.env.PORT))


