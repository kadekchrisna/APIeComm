'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Checkout extends Model {
    products() {
        return this.hasMany('App/Models/CheckoutProduct', 'id', 'checkout_id')
    }

}

module.exports = Checkout
