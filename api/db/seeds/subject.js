/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('subject').del()
  await knex('subject').insert([
    {id: 1, bidang: 'UI UX'},
    {id: 2, bidang: 'Frontend'},
    {id: 3, bidang: 'backend'},
    {id: 4, bidang: 'persiapan karir'},
    {id: 5, bidang: 'musik'}
  ]);
};
