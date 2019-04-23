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
        Route.get('products/:id', 'ProductController.show')
        Route.patch('products/:id', 'ProductController.update')
        Route.delete('products/:id', 'ProductController.destroy')
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
        Route.post('carts', 'CartController.store').middleware(['auth'])
        Route.get('carts/:id', 'CartController.show').middleware(['auth'])
        Route.patch('carts/:id', 'CartController.update')
        Route.delete('carts/:id', 'CartController.destroy')
    })
    .prefix('api/v1')

//Auth
Route
    .group(() => {
        Route.post('auth/register', 'AuthController.register')
        Route.post('auth/login', 'AuthController.login')
        Route.get('user/data', 'AuthController.getProfile').middleware(['auth'])
    })
    .prefix('api/v1')

//Category
Route
    .group(() => {
        Route.post('category', 'CategoryController.store')
        Route.get('category', 'CategoryController.index')
        Route.get('category/:id', 'CategoryController.show')
    })
    .prefix('api/v1')

//Checkout
Route
    .group(() => {
        Route.post('checkout', 'CheckoutController.store')
        Route.get('checkout/:id', 'CheckoutController.show')
    })
    .prefix('api/v1')