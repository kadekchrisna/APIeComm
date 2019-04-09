'use strict'

const Image = use('App/Models/Image')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with images
 */
class ImageController {
    /**
     * Show a list of all images.
     * GET images
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async index({ request, response, view }) {
        const image = await Image.all()
        response.status(200).json({
            message: 1,
            data: image
        })
    }

    /**
     * Render a form to be used for creating a new image.
     * GET images/create
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async create({ request, response, view }) {
    }

    /**
     * Create/save a new image.
     * POST images
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async store({ request, response }) {
        const { uri, product_id } = request.post()

        const image = new Image()

        image.uri = uri
        image.product_id = product_id

        await image.save()

        response.status(200).json({
            message: 'Successfully add new Image',
            data: image
        })
    }

    /**
     * Display a single image.
     * GET images/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async show({ params, request, response, view }) {
        const image = await Image.query()
            .where('product_id', params.id).fetch()

        if(image){
            response.status(200).json({
                message: 'Successfully show detail image',
                data: image
            })

        }else{
            response.status(404).json({
                message: 'Image not found',
                id
            })
        }
    }

    /**
     * Render a form to update an existing image.
     * GET images/:id/edit
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async edit({ params, request, response, view }) {
    }

    /**
     * Update image details.
     * PUT or PATCH images/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({ params, request, response }) {
    }

    /**
     * Delete a image with id.
     * DELETE images/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params, request, response }) {
    }
}

module.exports = ImageController
