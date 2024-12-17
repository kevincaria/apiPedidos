import { Request, Response } from 'express';
import { Product } from '../models/product.model';
import { saveToCache } from '../middlewares';

export const ProductsController = {
    getProducts: async (req: Request, res: Response): Promise<void> => {
        const products = await Product.find();
        saveToCache(products, 'products');
        res.status(200).json(products);
    },

    getProductById: async (req: Request, res: Response): Promise<void> => {
        const _id = req.params.id;
        const product = await Product.findById(_id);
        if (product) {
            saveToCache(product, `products:${_id}`);
        }
        res.status(200).json(product);
    },

    createProduct: async (req: Request, res: Response): Promise<void> => {
        const newProduct = await Product.create(req.body);
        res.status(201).json(newProduct);
    },

    deleteProduct: async (req: Request, res: Response): Promise<void> => {
        const _id = req.params.id;
        const result = await Product.deleteOne({ _id });
        res.status(200).json({ message: `Filas afectadas: ${result.deletedCount}` });
    },

    updateProduct: async (req: Request, res: Response): Promise<void> => {
        const _id = req.params.id;
        const product = await Product.findByIdAndUpdate(_id, req.body, { new: true });
        res.status(200).json(product);
    }
};