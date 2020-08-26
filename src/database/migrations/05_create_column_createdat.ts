import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.alterTable('connections', (t) => {
        t.timestamp('created_at')
            .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
            .notNullable();
        
    })
}

export async function down(knex: Knex) {
    knex.schema.dropTable('connections');
}


