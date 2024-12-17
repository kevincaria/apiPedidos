const { Router } = require('express');
const productsController = require('../controllers/products.controller');
const middleware = require('../middleware');
const Product = require('../models/product.model');

const route = Router();

route.get('/productos',
    middleware.redisMiddleware.checkCache('products'),
    productsController.getProducts
)

route.get('/productos/:id',
    middleware.redisMiddleware.checkCache('products'),
    middleware.genericMiddleware.validateId(Product),
    productsController.getProductById
)

route.post('/productos',
    middleware.redisMiddleware.deleteCache('products'),
    productsController.createProduct
)

route.delete('/productos/:id',
    middleware.genericMiddleware.validateId(Product),
    middleware.redisMiddleware.deleteCache('products'),
    productsController.deleteProduct
)

route.put('/productos/:id',
    middleware.genericMiddleware.validateId(Product),
    middleware.redisMiddleware.deleteCache('products'),
    productsController.updateProduct
)