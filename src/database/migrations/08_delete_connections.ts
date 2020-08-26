import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.dropTable('connections');
}

export async function down(knex: Knex) {
    knex.schema.dropTable('connections');
}


