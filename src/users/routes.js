const { Router } = require('express')
const Joi = require('joi')

const withAsyncErrorHandler = require('../middlewares/async-error')
const validate = require('../middlewares/validate')

const router = Router()

const { UsersRepository } = require('./repository')

const repository = UsersRepository()

/*
  CRUD de usuários
  - C: create
  - R: read (listar + detalhes)
  - U: update
  - D: delete
*/

const nameRegex = /^[A-Z][a-z]+$/

// ************
// ** create **
// ************

const createUserSchema = {
  body: Joi.object({
    username: Joi.string().email().required(),
    password: Joi.string().min(5).max(40).required(),
    firstName: Joi.string().regex(nameRegex).required(),
    lastName: Joi.string().regex(nameRegex).required(),
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
    password: Joi.string().min(5).max(40).required(),
    firstName: Joi.string().regex(nameRegex).required(),
    lastName: Joi.string().regex(nameRegex).required(),
  }).or('firstName', 'lastName', 'password'),
  params: {
    id: Joi.number().required(),
  }
}

const updateUser = async (req, res) => {
  const id = parseInt(req.params.id)

  const body = req.body

  await repository.get(id)

  const user = { ...registered, ...body, id  }
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
  const id = parseInt(req.params.id)

  const user = await repository.get(id)

  res.status(200).send(user)
}

router.get('/', withAsyncErrorHandler(listUsers))
router.get('/:id', validate(getUserSchema), withAsyncErrorHandler(getUser))

module.exports = router