/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('mentor', (table) => {
    table.increments('id').primary();
    table.string('nama', 150).notNullable();
    table.string('email', 100).notNullable();
    table.string('password', 255).notNullable();
    table.string('alamat', 150);
    table.text('deskripsi');
    table.integer('id_subject')
    .unsigned()
    .index('foreign_key_subject_mentor')
    .references('id')
    .inTable('subject');
    table.string('background', 200);
    table.bigInteger('tarif');
    table.string('pendidikan', 100);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('mentor');
};
