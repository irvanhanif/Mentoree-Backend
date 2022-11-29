/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('mentee', (table) => {
        table.increments('id').primary();
        table.string('nama', 150).notNullable();
        table.string('email', 100).notNullable();
        table.string('password', 250).notNullable();
        table.string('status', 100);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('mentee');
};
