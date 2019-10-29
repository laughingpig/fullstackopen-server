require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Contact = require('./models/contact')

const app = express()
const bodyParser = require('body-parser')
app.use(express.static('build'))
app.use(bodyParser.json())
morgan.token('json', function getJson (req) {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :response-time :json'))
app.use(cors())

app.get('/api/persons',(req,res,next) => {
  Contact.find({}).then(persons => {
    res.json(persons.map(person => person.toJSON()))
  })
})

app.get('/api/persons/:id',(req,res,next) => {
  Contact.findById(req.params.id).then(person => {
    if(person){
      res.json(person.toJSON())
    }
    else {
      res.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.put('/api/persons/:id',(req,res,next) => {
  newPerson = {
    name: req.body.name,
    number: req.body.number
  }
  Contact.findByIdAndUpdate(req.params.id, newPerson, { new: true }).then(person => {
    if(person){
      res.json(person.toJSON())    
      console.log("error")
    }
    else {
      res.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.post('/api/persons',(req,res,next) => {
  const person = req.body

  const newPerson = new Contact({
    "name": req.body.name,
    "number": req.body.number,
  })
  newPerson.save().then(savedPerson => 
    res.json(savedPerson.toJSON())
  )
  .catch(error => next(error))
})

app.delete('/api/persons/:id',(req,response,next) => {
  Contact.findByIdAndDelete(req.params.id)
    .then(result => {
      console.log(result)
      response.status(204).end()  
    })
})

app.get('/info',(req,res) => {
  Contact.find({}).then(persons => {
    const count = persons.length
    const date = new Date()
    res.send(`Phonebook has info for ${count} people<br>`+date)  
  })
  .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }

  next(error)
}

// handler of requests with result to errors
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)  
})