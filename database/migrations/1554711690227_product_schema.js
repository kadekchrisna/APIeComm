'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductSchema extends Schema {
    up() {
        this.create('products', (table) => {
            table.increments()
            table.timestamps()
            table.string('name',190)
            table.text('description')
            table.string('uri',190)
            table.integer('quantity').defaultTo(1)
            table.integer('price')

        })
    }

    down() {
        this.drop('products')
    }
}

module.exports = ProductSchema
