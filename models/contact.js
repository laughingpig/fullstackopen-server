const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const URL = process.env.MONGODB_URI

mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true  })
  .then(() => console.log('connected to mongoDB'))
  .catch(error => console.log('error connectiong', error))

const contactSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true, minlength: 3 },
  number: { type: String, required: true, minlength: 8 },
})
contactSchema.plugin(uniqueValidator)

contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Contact', contactSchema)
