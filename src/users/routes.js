const { Router } = require('express')
const Joi = require('joi')

const withAsyncErrorHandler = require('../middlewares/async-error')
const validate = require('../middlewares/validate')

const router = Router()

const { UsersRepository } = require('./repository')

const repository = UsersRepository()

const NotFound = {
  error: 'Not found',
  message: 'Resource not found',
}

/*
  CRUD de usuários
  - C: create
  - R: read (listar + detalhes)
  - U: update
  - D: delete
*/

// ************
// ** create **
// ************

const createUserSchema = {
  body: Joi.object({
    username: Joi.string().email().required(),
    name: Joi.string().regex(/^[A-Za-z]+(\s?[A-Za-z])*$/).required(),
    password: Joi.string().min(5).max(40).required(),
  })
}

const createUser = async (req, res) => {
  const user = req.body

  const inserted = await repository.insert(user)
  const location = `/api/users/${inserted.id}`
  res.status(201).header('Location', location).send(inserted)
}

router.post('/', validate(createUserSchema), withAsyncErrorHandler(createUser))

// ************
// ** update **
// ************

const updateUserSchema = {
  body: Joi.object({
    name: Joi.string().regex(/^[A-Za-z]+(\s?[A-Za-z])*$/).required(),
    password: Joi.string().min(5).max(40).required(),
  }).or('name', 'password'),
  params: {
    id: Joi.number().required(),
  }
}

const updateUser = async (req, res) => {
  // e se for NaN ?
  const id = parseInt(req.params.id)

  // e se não for um JSON de usuário válido ?
  const body = req.body

  await repository.get(id)

  const user = { ...body, id }
  const updated = await repository.update(user)
  res.status(200).send(updated)
}

router.put('/:id', validate(updateUserSchema), withAsyncErrorHandler(updateUser))

// ************
// ** delete **
// ************

const deleteUserSchema = {
  params: {
    id: Joi.number().required(),
  }
}

const deleteUser = async (req, res) => {
  // e se for NaN ?
  const id = parseInt(req.params.id)

  await repository.get(id)

  await repository.del(id)
  res.status(204).send()
}

router.delete('/:id', validate(deleteUserSchema), withAsyncErrorHandler(deleteUser))

// **********
// ** read **
// **********

const listUsers = async (_req, res) =>
  repository
    .list()
    .then(users => res.status(200).send({ users }))

const getUserSchema = {
  params: {
    id: Joi.number().required(),
  }
}

const getUser = async (req, res) => {
  // e se for NaN
  const id = parseInt(req.params.id)

  const user = await repository.get(id)

  res.status(200).send(user)
}

router.get('/', withAsyncErrorHandler(listUsers))
router.get('/:id', validate(getUserSchema), withAsyncErrorHandler(getUser))

module.exports = router