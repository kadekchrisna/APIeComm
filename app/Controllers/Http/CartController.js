'use strict'

const Cart = use('App/Models/Cart')
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

        const { user_id, product_id, product_qty, total } = request.post()

        // Checking if there is already cart for this user 
        const cartCheck = await Cart.query()
            .where('user_id', user_id)
            .getCount()

        if (cartCheck < 1) {
            // if there's none make one
            const cart = new Cart()
            cart.product_id = product_id
            cart.product_qty = product_qty
            cart.price = total
            cart.total = total * product_qty
            cart.user_id = user_id

            await cart.save()
            response.status(200).json({
                message: 'Cart added successfully.',
                data: cart
            })

        } else {
            // if there is one then check if the cart has the product
            const cart = await Cart.query()
                .where('user_id', user_id)
                .where('product_id', product_id)
                .getCount()

            if (cart < 1) {
                // if the cart doesnt has the product add it 
                const cart = new Cart()
                cart.product_id = product_id
                cart.product_qty = product_qty
                cart.price = total
                cart.total = total * product_qty
                cart.user_id = user_id

                await cart.save()

                const cartPrice = await Cart.query()
                    .where('user_id', user_id)
                    .sum('total as total')

                response.status(200).json({
                    message: 'Checkout added successfully.',
                    data: cart,
                    total: cartPrice[0].total
                })

            } else {
                // if the cart has the product then add the qty of the product
                const cartCheck = await Cart.query()
                    .select('id')
                    .where('user_id', user_id)
                    .where('product_id', product_id)
                    .fetch()

                const idCart = cartCheck.rows[0].id

                const cart = await Cart.find(idCart)
                cart.product_qty = cart.product_qty + 1
                cart.total = cart.price * cart.product_qty

                await cart.save()

                const cartPrice = await Cart.query()
                    .where('user_id', user_id)
                    .sum('total as total')

                response.status(200).json({
                    message: 'Checkout added successfully.',
                    data: cart,
                    total: cartPrice[0].total
                })

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

        const product = await Product.query()
            .leftJoin('carts', 'products.id', 'carts.product_id')
            .where('carts.user_id', params.id)
            .fetch()

        const cartPrice = await Cart.query()
            .where('user_id', params.id)
            .sum('total as total')

        response.status(200).json({
            status: 1,
            data: product,
            total: cartPrice[0].total
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

        const idCart = parseInt(params.id)

        // const idProduct = parseInt(params.product)

        const cart = await Cart.find(idCart)
        const total = cart.price * qty
        const idUser = cart.user_id
        const idProduct = cart.product_id
        cart.product_qty = qty
        cart.total = total

        await cart.save()

        const product = await Product.query()
            .leftJoin('carts', 'products.id', 'carts.product_id')
            .where('carts.product_id', idProduct)
            .where('carts.user_id', idUser)
            .fetch()
        const cartPrice = await Cart.query()
            .where('user_id', idUser)
            .sum('total as total')

        response.status(200).json({
            message: 'Checkout updated successfully.',
            data: product.rows[0],
            total: cartPrice[0].total
        })
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
        const cart = await Cart.find(params.id)
        const idUser = cart.user_id
        await cart.delete()

        const product = await Product.query()
            .leftJoin('carts', 'products.id', 'carts.product_id')
            .where('carts.user_id', idUser)
            .fetch()
        const cartPrice = await Cart.query()
            .where('user_id', idUser)
            .sum('total as total')

        response.status(200).json({
            message: 'Checkout deleted successfully.',
            data: product,
            total: cartPrice[0].total
        })

    }
}

module.exports = CartController