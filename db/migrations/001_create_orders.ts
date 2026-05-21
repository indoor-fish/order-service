import type { Knex } from 'knex';
export async function up(knex: Knex) {
  await knex.schema.createTable('orders', t => {
    t.uuid('id').primary().defaultTo(knex.fn.uuid());
    t.string('user_id').notNullable();
    t.enum('status', ['PENDING','CONFIRMED','SHIPPED','DELIVERED','CANCELLED']).defaultTo('PENDING');
    t.decimal('total_amount', 12, 2).notNullable();
    t.timestamps(true, true);
  });
}
export async function down(knex: Knex) { await knex.schema.dropTable('orders'); }
