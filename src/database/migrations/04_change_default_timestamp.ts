import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.alterTable('connections', (t) => {
        t.dropColumn('created_at');
        
    })
}

export async function down(knex: Knex) {
    knex.schema.dropTable('connections');
}