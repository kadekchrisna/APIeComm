'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CheckoutsSchema extends Schema {
    up() {
        this.create('checkouts', (table) => {
            table.increments()
            table.timestamps()
            table
                .integer("user_id")
                .unsigned()
                .references("id")
                .inTable("users")
                .onDelete("CASCADE");
            table.string('province',190)
            table.string('city',190)
            table.string('phone',190)
            table.text('address')
            table.integer('courier')
            table.integer('bill')
        })
    }

    down() {
        this.drop('checkouts')
    }
}

module.exports = CheckoutsSchema
