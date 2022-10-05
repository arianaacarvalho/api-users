const fetch = require('node-fetch')
const {abortController} = require('abort-controller')

class HttpStatusError extends Error {
  constructor({body, status}){
    super(`Request failed with status ${status}`)
    this.name = HttpStatusError
    this.body = body
    this.status = status
  }
}

const rejectHttpStatusError = res =>
  res
    .text()
    .then(body => new HttpStatusError({ body, status: res.status }))
    .then(error => Promise.reject(error))

const createUser = (user, timeout=10.000) => {
  const controller = new abortController()
  const timeoutId = setTimeout(() => {
    controller.abort()
  }, timeout)
  fetch('http://localhost:3000/api/users', {
    method: 'POST',
    headers: {
      'Content-Type' : 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(user),
    signal: controller.signal,
  })
  .then(res => !res.ok
    ? rejectHttpStatusError(res)
    : res

  )
  .then(res => res.json())
  .finally(() => {
    clearTimeout(timeoutId)
  })

  createUser({
    username: 'b@a.com',
    firstName: 'Nao',
    lastName: 'Importa',
    password: '123456',
  })
  .then((body) => console.log(`Recebemos o body:\n`, body))
  .catch(console.error)
}
