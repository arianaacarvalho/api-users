const express = require('express')
const users = require('./users/routes')
const logger = require('./middlewares/logger')

const app = express()

app.use(express.json())
app.use('/users', users)
app.use('/logger', logger)

app
  .listen(3000, '0.0.0.0', () =>{
    console.log('Service Started')
  })
  .once('error', (error) => {
    console.error(error)
    ProcessingInstruction.exit(1)
  })