'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddressesSchema extends Schema {
  up () {
    this.create('addresses', (table) => {
      table.increments()
      table.timestamps()
      table.string('name', 190)
      table.string('uri')
    })
  }

  down () {
    this.drop('addresses')
  }
}

module.exports = AddressesSchema
