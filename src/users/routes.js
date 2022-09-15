const {Router} = require('express')
const withAsyncErrorHandler = require('../middlewares/async-error.js')

const router = Router()

//CRUD:
//Create: endpoint que faz a criação de novos usuários
//POST /users {...users}
const createUser = async (req, res) => {
  res.staus(201).header('Location', '/users/???').send({})
}
router.post('/', withAsyncErrorHandler(createUser))

//Read: endpoint que faz a leitura e lista usuários
//GET /users {users: [..users]}
router.get('/', withAsyncErrorHandler(async (req, res) => {
  res.status(200).send({users: []})
}))
//GET /users/:id {...user}
router.get('/:id', withAsyncErrorHandler(async (req, res) => {
  res.status(200).send({})
}))

//Update: endpoint que faz a atualização de dados
//PUT /users/:id {...updatableUser}
router.put('/:id', withAsyncErrorHandler(async (req, res) => {
  res.status(200).send({})
}))

//Delete: endpoint que remove um usário
//DELETE /users/:id ''
router.delete('/:id', async (req, res) => {
  res.status(204).send()
})

module.exports = router