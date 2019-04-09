'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CheckoutSchema extends Schema {
  up () {
    this.create('checkouts', (table) => {
      table.increments()
      table.timestamps()
      table.integer('total')
      table.integer('product_id').unsigned()
      table.foreign('product_id').references('products.id').onDelete('cascade')
      table.integer('product_qty')
      table.integer('cart_id').unsigned()
      table.foreign('cart_id').references('carts.id').onDelete('cascade')
    })
  }

  down () {
    this.drop('checkouts')
  }
}

module.exports = CheckoutSchema
