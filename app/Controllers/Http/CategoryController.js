'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with categories
 */

const Category = use('App/Models/Category')
const { validate } = use("Validator");

class CategoryController {
    /**
     * Show a list of all categories.
     * GET categories
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async index({ request, response, view }) {
        try {
            const category = await Category.all()
            return response.status(200).json({
                message: 'Get all categories success.',
                data: category
            })
        } catch (error) {
            return response.status(400).json({
                message: 'Somethinf went wrong!'
            })
            
        }
    }

    /**
     * Render a form to be used for creating a new category.
     * GET categories/create
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async create({ request, response, view }) {
    }

    /**
     * Create/save a new category.
     * POST categories
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async store({ request, response }) {
        try {
            const rules = {
                name: 'required|string',
                uri: 'required|string',
            }
            const validation = await validate(request.all(), rules);
            if (validation.fails())
                return response.status(400).json({
                    message: validation.messages()
                });

            const categoryData = request.only(['name', 'uri'])

            const category = await Category.create(categoryData)

            return response.status(201).json({
                message: 'New category added.',
                data: category
            })

        } catch (error) {
            return response.status(400).json({
                message: 'Something went wrong!'
            })

        }
    }

    /**
     * Display a single category.
     * GET categories/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async show({ params, request, response, view }) {
        
        const Product = use ('App/Models/Product')

        try {
            const category = await Category.find(params.id)
            if (category == null) {
                return response.status(404).json({
                    message: 'Category not found.'
                })
            }

            const product = await Product.query()
                .where('category_id', params.id)
                .fetch()

            return response.status(200).json({
                message: 'Get category success.',
                data: product
            })
        } catch (error) {
            
        }
    }

    /**
     * Render a form to update an existing category.
     * GET categories/:id/edit
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async edit({ params, request, response, view }) {
    }

    /**
     * Update category details.
     * PUT or PATCH categories/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({ params, request, response }) {
    }

    /**
     * Delete a category with id.
     * DELETE categories/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params, request, response }) {
    }
}

module.exports = CategoryController
