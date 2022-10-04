/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
  .createTable('users', (table) => {
    table.increments('id').primary()
    table.string('username', 255).notNullable().unique()
    table.string('password', 100).notNullable()
    table.string('first_name', 255).notNullable()
    table.string('last_name', 255).notNullable()
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('users')
};
