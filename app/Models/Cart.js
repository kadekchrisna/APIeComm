'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Cart extends Model {
    checkouts() {
        return this.hasMany('App/Models/Checkout')
    }
}

module.exports = Cart
