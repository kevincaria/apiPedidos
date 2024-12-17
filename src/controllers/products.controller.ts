import { Request, Response } from 'express';

const Product = require('../models/product.model');
const { saveToCache } = require('../middlewares/redis.middleware');

const getAllProducts = async (req: Request, res: Response): Promise<void> => {
    const products = await Product.find();
    saveToCache('products', products);
    res.status(200).json(products);
}

const getProductById = async (req: Request, res: Response): Promise<void> => {
    const _id = req.params.id;
    const product = await Product.findById({ _id });
    saveToCache(product,  `productos:${_id}`);
    res.status(200).json(product);
}

const createProduct = async (req: Request, res: Response): Promise<void> => {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
}

const deleteProductById = async (req: Request, res: Response): Promise<void> => {
    const _id = req.params.id;
    const result = await Product.deleteOne({ _id });
    res.status(200).json({ message: `Filas afectadas: ${result.deletedCount}` });
}

const updateProductById = async (req: Request, res: Response): Promise<void> => {
    const _id = req.params.id;
    const product = await Product.updatefindByIdAndUpdate(_id, req.body, { new: true })
    res.status(200).json(product);
}

module.exports = { getAllProducts, getProductById, createProduct, deleteProductById, updateProductById };