'use strict'

const Product = use('App/Models/Product')

const { validate } = use("Validator");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with products
 */
class ProductController {
    /**
     * Show a list of all products.
     * GET products
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async index({ request, response, view }) {
        const product = await Product.all()
        response.status(200).json({
            message: 1,
            data: product
        })
    }

    /**
     * Render a form to be used for creating a new product.
     * GET products/create
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async create({ request, response, view }) {
    }

    /**
     * Create/save a new product.
     * POST products
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async store({ request, response }) {
        const rules = {
            name: 'required|string',
            price: 'required|number',
            description: 'required'
        }
        const validation = await validate(request.all(), rules);
        if (validation.fails()) {
            return response
                .status(400)
                .json({ status: 0, message: validation.messages() });
        } else {

            const { name, description, price, quantity } = request.post()

            const product = new Product()

            product.name = name
            product.description = description
            product.price = price
            product.quantity = quantity

            await product.save()

            // const product = await Product.create({ name, description, price, quantity })

            response.status(200).json({
                status: 1,
                data: product
            })

        }

    }

    /**
     * Display a single product.
     * GET products/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async show({ params, request, response, view }) {
        const product = request.post().product

        response.status(200).json({
            status: 1,
            data: product
        })

    }

    /**
     * Render a form to update an existing product.
     * GET products/:id/edit
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async edit({ params, request, response, view }) {
    }

    /**
     * Update product details.
     * PUT or PATCH products/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({ params, request, response }) {
        const rules = {
            name: 'string',
            price: 'number',
        }
        const validation = await validate(request.all(), rules);
        if (validation.fails()) {
            return response
                .status(400)
                .json({ status: 0, message: validation.messages() });
        }else{

            const { name, description, price, quantity, product } = request.post()
    
            product.name = name
            product.description = description
            product.price = price
            product.quantity = quantity
    
            await product.save()
    
            response.status(200).json({
                status: 1,
                data: product
            })

        }
    }

    /**
     * Delete a product with id.
     * DELETE products/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params, request, response }) {
        const product = request.post().product
        await product.delete()


    }
}

module.exports = ProductController
