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
Route.post('api/v1/products', 'ProductController.store')
Route.get('api/v1/products', 'ProductController.index')
Route.get('api/v1/product/:id', 'ProductController.show').middleware(['findProduct'])
Route.patch('api/v1/product/:id', 'ProductController.update').middleware(['findProduct'])
Route.delete('api/v1/product/:id', 'ProductController.destroy').middleware(['findProduct'])

//Images
Route.post('api/v1/images', 'ImageController.store')
Route.get('api/v1/images', 'ImageController.index')
Route.get('api/v1/image/:id', 'ImageController.show')


//Store
Route.post('api/v1/carts','CartController.store')
