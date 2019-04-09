'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CategorySchema extends Schema {
  up () {
    this.create('categories', (table) => {
      table.increments()
      table.timestamps()
      table.string('name', 190)
      table.integer('product_id').unsigned()
      table.foreign('product_id').references('id').inTable('products').onDelete('cascade')
      table.string('uri')
    })
  }

  down () {
    this.drop('categories')
  }
}

module.exports = CategorySchema
