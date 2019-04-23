'use strict'

const Product = use('App/Models/Product')

const { validate } = use("Validator");

class ProductController {
    async index({ request, response, view, auth }) {
        try {
            const product = await Product.all()
            return response.status(200).json({
                message: 'Show all products success.',
                data: product
            })

        } catch (error) {
            console.log(error);
            return response.status(404).json({
                message: 'Something went wrong!',
            })

        }
    }

    async create({ request, response, view }) {
    }

    async store({ request, response }) {

        try {
            const rules = {
                name: 'required|string',
                uri: 'required|string',
                price: 'required|number',
                description: 'required',
                quantity: 'required|number',
            }
            const validation = await validate(request.all(), rules);
            if (validation.fails())
                return response.status(400).json({
                    message: validation.messages()
                });

            const productData = request.only(['name', 'description', 'price', 'uri', 'quantity'])

            const product = await Product.create(productData)

            return response.status(201).json({
                message: 'New product added.',
                data: product
            })

        } catch (error) {
            return response.status(400).json({
                message: 'Something went wrong!',
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
        try {
            const product = await Product.find(params.id)

            if (product == null) return response.status(404).json({ 'message': 'No record found!' })

            return response.status(200).json({
                message: 'Get specific product success.',
                data: product
            })
        } catch (error) {
            return response.status(400).json({
                message: 'Something went wrong!',
            })

        }

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
        try {

            const rules = {
                name: 'string',
                price: 'number',
                description: 'string',
                quantity: 'number'
            }
            const validation = await validate(request.all(), rules);
            if (validation.fails()) {
                return response.status(400).json({
                    message: validation.messages()
                });
            } else {

                const data = request.all()

                const product = await Product.find(params.id)

                product.merge(data)

                await product.save()

                return response.status(200).json({
                    data: product
                })

            }
        } catch (error) {
            console.log(error);
            return response.status(400).json({
                message: 'Something went wrong!',
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
        try {
            const product = Product.find(params.id)
            if (product == null) {
                return response.status(404).json({
                    message: 'Product not found.'
                })
            }
            await product.delete()

        } catch (error) {
            console.log(error);
            return response.status(400).json({
                message: 'Something went wrong!',
            })

        }


    }
}

module.exports = ProductController
