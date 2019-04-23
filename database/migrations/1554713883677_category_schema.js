'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CategorySchema extends Schema {
    up() {
        this.create('categories', (table) => {
            table.increments()
            table.timestamps()
            table.string('name', 190)
            table.string('uri')
        })

        this.alter('products', (table) => {
            table.foreign('category_id').references('id').inTable('categories').onDelete('cascade')            
        })
    }

    down() {
        this.drop('categories')
    }
}

module.exports = CategorySchema
