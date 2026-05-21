import type { Knex } from 'knex';
export async function up(knex: Knex) {
  await knex.schema.createTable('order_lines', t => {
    t.uuid('id').primary().defaultTo(knex.fn.uuid());
    t.uuid('order_id').references('id').inTable('orders').onDelete('CASCADE');
    t.string('product_id').notNullable();
    t.integer('quantity').notNullable();
    t.decimal('unit_price', 12, 2).notNullable();
  });
}
export async function down(knex: Knex) { await knex.schema.dropTable('order_lines'); }
