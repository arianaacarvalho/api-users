const express = require('express')
const users = require('./users/routes')
const logger = require('./middlewares/logger')
const errorHandler = require('./middlewares/error')

const app = express()
const router = express.Router()

router.use(express.json())
router.use('/users', users)
router.use('/logger', logger)

router.use(errorHandler)

app.use('/api', router)

app
  .listen(3000, '0.0.0.0', () =>{
    console.log('Service Started')
  })
  .once('error', (error) => {
    console.error(error)
    ProcessingInstruction.exit(1)
  })