'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with checkouts
 */
const Checkout = use('App/Models/Checkout')
const CheckoutProduct = use('App/Models/CheckoutProduct')
const Cart = use('App/Models/Cart')

const { validate } = use('Validator')

class CheckoutController {
    /**
     * Show a list of all checkouts.
     * GET checkouts
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async index({ request, response, view }) {
    }

    /**
     * Render a form to be used for creating a new checkout.
     * GET checkouts/create
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async create({ request, response, view }) {
    }

    /**
     * Create/save a new checkout.
     * POST checkouts
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async store({ request, response }) {

        const User = use('App/Models/User')
        const Product = use('App/Models/Product')

        try {

            const rules = {
                user_id: 'required|number',
                province: 'required|string',
                city: 'required|string',
                address: 'required|string',
                phone: 'required|string',
                courier: 'required|number',
                bill: 'required|number',
            }
            const validation = await validate(request.all(), rules);
            if (validation.fails())
                return response.status(400).json({
                    message: validation.messages()
                });

            const { user_id } = request.post()

            // , product_id, product_qty, total, user_id, province, city, address, phone, courier, bill
            const user = await User.find(user_id)
            if (user == null)
                return response.status(404).json({
                    message: 'User not found!'
                })

            const checkoutData = request.only(['user_id', 'province', 'city', 'address', 'phone', 'courier', 'bill'])
            const checkout = await Checkout.create(checkoutData)

            const idCheckout = checkout.id;

            const cart = await Product.query()
                .leftJoin('carts', 'products.id', 'carts.product_id')
                .where('carts.user_id', user_id)
                .fetch()
            const cartJSON = cart.toJSON()
            // console.log(cartJSON);

            cartJSON.forEach(val => {
                const checkoutProduct = new CheckoutProduct()
                checkoutProduct.checkout_id = idCheckout
                checkoutProduct.product_id = val.product_id
                checkoutProduct.quantity = val.product_qty
                checkoutProduct.weight = val.weight
                checkoutProduct.uri = val.uri
                checkoutProduct.name = val.name


                checkoutProduct.save()
            });

            await Cart.query()
                .where('user_id', user_id)
                .delete()

            return response.status(201).json({
                message: 'Checkout added successfully',
                data: checkout,
                id: idCheckout
            })
        } catch (error) {
            console.log(error);
            return response.status(400).json({
                message: 'Something went wrong!'
            })

        }
    }

    /**
     * Display a single checkout.
     * GET checkouts/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async show({ params, request, response, view }) {
        const User = use('App/Models/User')
        try {

            const user = await User.find(params.id)
            if (user == null)
                return response.status(404).json({
                    message: 'User not found!'
                })

            const checkout = await Checkout.query()
                .where('user_id', params.id)
                .with('products')
                .fetch()
            
            return response.status(200).json({
                message: 'Get cart for this user success.',
                data: checkout,
            })

        } catch (error) {
            console.log(error);
            return response.status(400).json({
                message: 'Something went wrong!'
            })

        }

    }

    /**
     * Render a form to update an existing checkout.
     * GET checkouts/:id/edit
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async edit({ params, request, response, view }) {
    }

    /**
     * Update checkout details.
     * PUT or PATCH checkouts/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({ params, request, response }) {
    }

    /**
     * Delete a checkout with id.
     * DELETE checkouts/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params, request, response }) {
    }
}

module.exports = CheckoutController
