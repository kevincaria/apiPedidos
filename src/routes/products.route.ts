import { Router } from 'express';
import { ProductsController } from '../controllers/products.controller';
import { validateId, checkCache, deleteCache } from '../middlewares';
import { Product } from '../models/product.model';

const router = Router();

router.get('/productos',
    checkCache('products'),
    ProductsController.getProducts
);

router.get('/productos/:id',
    checkCache('products'),
    validateId(Product),
    ProductsController.getProductById
);

router.post('/productos',
    deleteCache('products'),
    ProductsController.createProduct
);

router.delete('/productos/:id',
    validateId(Product),
    deleteCache('products'),
    ProductsController.deleteProduct
);

router.put('/productos/:id',
    validateId(Product),
    deleteCache('products'),
    ProductsController.updateProduct
);

export default router;