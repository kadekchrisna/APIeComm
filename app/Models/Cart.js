'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Cart extends Model {
    static get primaryKey () {
        return 'id'
      }
}

module.exports = Cart
