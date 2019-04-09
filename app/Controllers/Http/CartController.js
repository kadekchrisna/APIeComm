'use strict'

const Cart = use('App/Models/Cart')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with carts
 */
class CartController {
    /**
     * Show a list of all carts.
     * GET carts
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async index({ request, response, view }) {
        const cart = await Cart.all(
            response.status(200).json({
                message: 'Get all Cart successfully.',
                data: cart
            })
        )
    }

    /**
     * Render a form to be used for creating a new cart.
     * GET carts/create
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async create({ request, response, view }) {

    }

    /**
     * Create/save a new cart.
     * POST carts
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async store({ request, response }) {
        const { total, user_id } = request.post()

        const cartCheck = await Cart.query()
            .where('user_id', user_id)
            .where('status', 0)
            .getCount()

        if (cartCheck > 0) {

        }else{
            
        }

        // const cart = await Cart.create({ total, user_id })
        response.status(200).json({
            message: 'Cart added successfully.',
            data: cartCheck
        })

    }

    /**
     * Display a single cart.
     * GET carts/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async show({ params, request, response, view }) {
    }

    /**
     * Render a form to update an existing cart.
     * GET carts/:id/edit
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async edit({ params, request, response, view }) {
    }

    /**
     * Update cart details.
     * PUT or PATCH carts/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({ params, request, response }) {
    }

    /**
     * Delete a cart with id.
     * DELETE carts/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params, request, response }) {
    }
}

module.exports = CartController
