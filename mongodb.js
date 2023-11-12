import mongoose from "mongoose";

let personModel = null;

mongoose.connect(process.env.MNGDB_URI)
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.log(`MongoDB connection failed: ${err}`))

  let Schema = new mongoose.Schema({
    name: {
      type: 'String',
      minLength: 2,
      maxLength: 100,
      required: true
    },
    number: {
      type: String,
      minLength: 5,
      maxLength: 25,
      required: true
    }
  })
  Schema.set('toJSON', {
    transform: (_, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })
  personModel = mongoose.model('Person', Schema)

  export default personModel;