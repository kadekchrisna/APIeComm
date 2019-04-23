'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CheckoutProductsSchema extends Schema {
    up() {
        this.create('checkout_products', (table) => {
            table.increments()
            table.timestamps()
            table
                .integer("checkout_id")
                .unsigned()
                .references("id")
                .inTable("checkouts")
                .onDelete("CASCADE");

            table
                .integer("product_id")
                .unsigned()
                .references("id")
                .inTable("products")
                .onDelete("CASCADE");
            table.integer("quantity").notNullable();
            table.integer("weight").notNullable();
        })
    }

    down() {
        this.drop('checkout_products')
    }
}

module.exports = CheckoutProductsSchema
