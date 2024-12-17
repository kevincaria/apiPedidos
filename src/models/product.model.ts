import mongoose from 'mongoose';
import { IProduct } from '../interfaces/product.interface';

const ProductSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true
  },
  descripcion: {
    type: String,
    required: true
  },
  precio: {
    type: Number,
    required: true,
    min: 0
  },
  categoria: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  }
});

export const Product = mongoose.model<IProduct>('Product', ProductSchema);