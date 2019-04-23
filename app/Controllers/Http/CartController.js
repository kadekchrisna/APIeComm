'use strict'

const Cart = use('App/Models/Cart')
const Product = use('App/Models/Product')

const { validate } = use("Validator");

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
        try {
            const cart = await Cart.all()
            return response.status(200).json({
                message: 'Get all Cart success.',
                data: cart
            })
        } catch (error) {
            console.log(error);
            return response.status(400).json({
                message: 'Something went wrong!'
            })


        }
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

        try {
            const rules = {
                user_id: 'required|number',
                product_id: 'required|number',
                product_qty: 'required|number',
                total: 'required|number',
            }
            const validation = await validate(request.all(), rules);
            if (validation.fails())
                return response.status(400).json({
                    message: validation.messages()
                });


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
                return response.status(201).json({
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

                    return response.status(201).json({
                        message: 'Cart added successfully.',
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

                    return response.status(201).json({
                        message: 'Cart added successfully.',
                        data: cart,
                        total: cartPrice[0].total
                    })

                }

            }

        } catch (error) {
            return response.status(400).json({
                message: 'Something went wrong!'
            })

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

        try {
            const product = await Product.query()
                .leftJoin('carts', 'products.id', 'carts.product_id')
                .where('carts.user_id', params.id)
                .fetch()

            const cartPrice = await Cart.query()
                .where('user_id', params.id)
                .sum('total as total')
                
            const productWeight = await Product.query()
                .leftJoin('carts', 'products.id', 'carts.product_id')
                .where('carts.user_id', params.id)
                .sum('weight as weight')

            return response.status(200).json({
                message: 'Get cart for this user success.',
                data: product,
                total: cartPrice[0].total,
                weight: productWeight[0].weight
            })

        } catch (error) {
            return response.status(400).json({
                message: 'Something went wrong!'
            })

        }

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

        try {
            const { qty } = request.post()

            const idCart = parseInt(params.id)

            // const idProduct = parseInt(params.product)

            const cart = await Cart.find(idCart)
            if (cart == null) {
                return response.status(404).json({
                    message: 'Product not found.',
                })
            }
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

            return response.status(200).json({
                message: 'Cart updated successfully.',
                data: product.rows[0],
                total: cartPrice[0].total
            })

        } catch (error) {
            return response.status(400).json({
                message: 'something went wrong!'
            })

        }


        // const Cart = await Cart.query()
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

        try {
            const cart = await Cart.find(params.id)
            const idUser = cart.user_id
            if (cart == null)
                return response.status(404).json({
                    message: 'product not found.'
                })
            await cart.delete()

            const product = await Product.query()
                .leftJoin('carts', 'products.id', 'carts.product_id')
                .where('carts.user_id', idUser)
                .fetch()
            const cartPrice = await Cart.query()
                .where('user_id', idUser)
                .sum('total as total')

            return response.status(200).json({
                message: 'Cart deleted successfully.',
                data: product,
                total: cartPrice[0].total
            })

        } catch (error) {
            return response.status(400).json({
                message: 'something went wrong!'
            })

        }

    }
}

module.exports = CartController