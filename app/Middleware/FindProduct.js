'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Product = use('App/Models/Product')

class FindProduct {
    /**
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Function} next
     */
    async handle({ request, response, params: { id } }, next) {
        // call next to advance the request
        const product = await Product.find(id)

        if(!product){
            return response.status(404).json({
                status: 0,
                id
            })
        }
        request.body.product = product
        await next()
    }
}

module.exports = FindProduct
