const express = require('express')
const morgan = require('morgan')

const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.json())
morgan.token('json', function getJson (req) {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :response-time :json'))

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  }
]

app.get('/api/persons',(req,res) => {
  res.json(persons)
})

app.get('/api/persons/:id',(req,res) => {
  const id = Number(req.params.id)
  const dat = persons.find(person => person.id === id)

  if(dat) {
    res.json(dat)
  }
  else {
    res.status(404).end()
  }
})

app.post('/api/persons',(req,res) => {
  const person = req.body
  if(req.body.name && req.body.number) {
    if(persons.find(person => person.name === req.body.name)) {
      res.status(400).json({'error': 'name must be unique'})
    }
    else {
      const newPerson = {
        "name": req.body.name,
        "number": req.body.number,
        "id": Math.floor(Math.random()*1000)
      }
      persons = persons.concat(newPerson)
      res.json(newPerson)  
    }    
  }
  else {
    res.status(400).json({'error': 'name and number required'})
  }
})

app.delete('/api/persons/:id',(req,response) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.get('/info',(req,res) => {
  const count = persons.length
  const date = new Date()
  res.send(`Phonebook has info for ${count} people<br>`+date)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${port}`)  
})