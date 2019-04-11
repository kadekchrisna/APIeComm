'use strict'

const Cart = use('App/Models/Cart')
const Checkout = use('App/Models/Checkout')
const Product = use('App/Models/Product')

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

        const { status, user_id, product_id, product_qty, total } = request.post()

        // Checking if there is already cart for this user and the cart not yet completed
        const cartCheck = await Cart.query()
            .where('user_id', user_id)
            .where('status', 0)
            .getCount()

        // response.status(200).json({
        //     message: 'Cart added successfully.',
        //     data: cartCheck
        // })


        if (cartCheck < 1) {
            const cart = await Cart.create({ status, user_id })
            response.status(200).json({
                message: 'Cart added successfully.',
                data: cart
            })

        } else {
            const cartCheck = await Cart.query()
                .where('user_id', user_id)
                .where('status', 0)
                .fetch()
            const cartId = cartCheck.rows[0].id
            const checkoutCheck = await Checkout.query()
                .where('cart_id', cartId)
                .getCount()

            if (checkoutCheck < 1) {

                const checkout = new Checkout()
                checkout.product_id = product_id
                checkout.product_qty = product_qty
                checkout.total = total * product_qty
                checkout.cart_id = cartId

                await checkout.save()

                const checkoutPrice = await Checkout.query()
                    .where('cart_id', cartId)
                    .sum('total as total')

                response.status(200).json({
                    message: 'Checkout added successfully.',
                    data: checkout,
                    total: checkoutPrice[0].total
                })

            } else {

                const checkoutCheck = await Checkout.query()
                    .where('product_id', product_id)
                    .where('cart_id', cartId)
                    .getCount()

                if (checkoutCheck > 0) {
                    const checkoutCheck = await Checkout.query()
                        .select('id', 'product_qty', 'total')
                        .where('product_id', product_id)
                        .where('cart_id', cartId)
                        .fetch()

                    const qtyProduct = checkoutCheck.rows[0].product_qty
                    const idCheckout = checkoutCheck.rows[0].id
                    const price = (checkoutCheck.rows[0].total) / qtyProduct

                    const checkout = await Checkout.find(idCheckout)
                    checkout.product_id = product_id
                    checkout.product_qty = qtyProduct + 1
                    checkout.total = price * (qtyProduct + 1)
                    checkout.cart_id = cartId

                    await checkout.save()

                    const checkoutPrice = await Checkout.query()
                        .where('cart_id', cartId)
                        .sum('total as total')

                    response.status(200).json({
                        message: 'Cart added successfully.',
                        data: checkout,
                        total: checkoutPrice[0].total
                    })

                } else {

                    const checkout = new Checkout()

                    checkout.product_id = product_id
                    checkout.product_qty = product_qty
                    checkout.cart_id = cartId
                    checkout.total = total * product_qty

                    await checkout.save()

                    const checkoutPrice = await Checkout.query()
                        .where('cart_id', cartId)
                        .sum('total as total')

                    response.status(200).json({
                        message: 'Checkout added successfully.',
                        data: checkout,
                        total: checkoutPrice[0].total
                    })

                }

            }
        }
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
        const cart = await Cart.query()
            .select('id')
            .where('user_id', params.id)
            .where('status', 0)
            .with('checkouts')
            .fetch()
        const idCart = cart.rows[0].id

        const product = await Product.query()
            .leftJoin('checkouts', 'products.id', 'checkouts.product_id')
            .where('checkouts.cart_id', idCart)
            .fetch()

        const checkoutPrice = await Checkout.query()
            .where('cart_id', idCart)
            .sum('total as total')

        response.status(200).json({
            status: 1,
            data: product,
            total: checkoutPrice[0].total
        })
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

        const { qty } = request.post()

        const idCheckout = parseInt(params.id)
        // const idProduct = parseInt(params.product)
        if (qty > 0) {
            const checkout = await Checkout.find(idCheckout)
            const total = (checkout.total / checkout.product_qty) * qty
            const idCart = checkout.cart_id
            checkout.product_qty = qty
            checkout.total = total

            await checkout.save()

            const product = await Product.query()
                .leftJoin('checkouts', 'products.id', 'checkouts.product_id')
                .where('checkouts.cart_id', idCart)
                .fetch()
            const checkoutPrice = await Checkout.query()
                .where('cart_id', idCart)
                .sum('total as total')

            response.status(200).json({
                message: 'Checkout updated successfully.',
                data: product,
                total: checkoutPrice[0].total
            })

        } else {
            const checkout = await Checkout.find(idCheckout)
            const total = (checkout.total / checkout.product_qty)
            const idCart = checkout.cart_id
            checkout.product_qty = 1
            checkout.total = total

            await checkout.save()

            const product = await Product.query()
                .leftJoin('checkouts', 'products.id', 'checkouts.product_id')
                .where('checkouts.cart_id', idCart)
                .fetch()
            const checkoutPrice = await Checkout.query()
                .where('cart_id', idCart)
                .sum('total as total')


            response.status(200).json({
                message: 'Checkout updated successfully.',
                data: product,
                total: checkoutPrice[0].total
            })


        }

        // const checkout = await Checkout.query()
        // .select('id')
        // .where('user_id', params.id)
        // .where('status', 0)
        // .with('checkouts')
        // .fetch()
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
        const checkout = await Checkout.find(params.id)
        const idCart = checkout.cart_id
        await checkout.delete()

        const product = await Product.query()
            .leftJoin('checkouts', 'products.id', 'checkouts.product_id')
            .where('checkouts.cart_id', idCart)
            .fetch()
        const checkoutPrice = await Checkout.query()
            .where('cart_id', idCart)
            .sum('total as total')

        response.status(200).json({
            message: 'Checkout deleted successfully.',
            data: product,
            total: checkoutPrice[0].total
        })

    }
}

module.exports = CartController
