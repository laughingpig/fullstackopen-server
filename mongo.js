const mongoose = require('mongoose')

if ( process.argv.length<3 ) {
  console.log('give password as an argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://fullstack:${password}@phonebook-balyu.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true  }).catch(error => 
  console.log(error)
)


const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number,
})

const Contact = mongoose.model('Contact', contactSchema)

if (process.argv.length< 4){
  Contact.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(contact => {
      console.log(`${contact.name} ${contact.number}`)
    })
    mongoose.connection.close()
  })
  .catch(error => 
    console.log(error)
  )
}
else {
  const contact = new Contact({
    name: name,
    number: number,
    id: Math.floor(Math.random()*1000),
  })

  contact.save().then(response => {
    console.log(`Added ${response.name} number ${response.number} to phonebook.`)
    mongoose.connection.close()
  })
  .catch(error => 
    console.log(error)
  )
}