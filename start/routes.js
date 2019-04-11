'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.on('/').render('welcome')

//Product
Route
    .group(() => {
        Route.post('products', 'ProductController.store')
        Route.get('products', 'ProductController.index')
        Route.get('products/:id', 'ProductController.show').middleware(['findProduct'])
        Route.patch('products/:id', 'ProductController.update').middleware(['findProduct'])
        Route.delete('products/:id', 'ProductController.destroy').middleware(['findProduct'])
    })
    .prefix('api/v1')

//Images
Route
    .group(() => {
        Route.post('images', 'ImageController.store')
        Route.get('images', 'ImageController.index')
        Route.get('images/:id', 'ImageController.show')
    })
    .prefix('api/v1')


//Cart
Route
    .group(() => {
        Route.post('carts', 'CartController.store')
        Route.get('carts/:id', 'CartController.show')
        Route.patch('carts/:id', 'CartController.update')
        Route.delete('carts/:id', 'CartController.destroy')
    })
    .prefix('api/v1')

