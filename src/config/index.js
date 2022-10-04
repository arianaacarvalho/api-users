const { UsersRepository } = require("../users/repository")

const database = {
  client: 'mysql2',
  conection: {
    host: 'localhost',
    port: 3306,
    user: 'staart',
    password: 'staart',
    database: users,
  }
}

module.exports = {
  database,
}