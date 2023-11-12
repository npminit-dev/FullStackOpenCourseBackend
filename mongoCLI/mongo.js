import mongoose from "mongoose";

console.log(process.argv)

const uri = `mongodb+srv://jorgebdevacc:${process.argv[2]}@cluster0.mszdubf.mongodb.net/?retryWrites=true&w=majority`
console.log(uri)
const newPerson = {
  name: process.argv[3],
  number: process.argv[4]
}

async function connect() {
  await mongoose.connect(uri);

  const personSchema = new mongoose.Schema({
    name: String,
    number: String
  })

  const Person = new mongoose.model('Person', personSchema)
  const person = new Person(newPerson)

  if(!newPerson.name || !newPerson.number) {
    let persons = await Person.find({})
    console.log(...persons)
    mongoose.connection.close()
    return
  } else {
    await person.save()
    console.log(`added ${newPerson.name} number ${newPerson.number} to phonebook!`)
    mongoose.connection.close()
    return
  }
}

connect()