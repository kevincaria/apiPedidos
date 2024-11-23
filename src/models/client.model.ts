import mongoose from 'mongoose';
import { IClient, IOrder, OrderStatus } from '../interfaces/client.interface';

const OrderProductSchema = new mongoose.Schema({
  producto_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  cantidad: {
    type: Number,
    required: true,
    min: 1
  },
  precio_unitario: {
    type: Number,
    required: true,
    min: 0
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  }
});

const OrderSchema = new mongoose.Schema({
  numero_pedido: {
    type: Number,
    required: true,
    unique: true
  },
  fecha_creacion: {
    type: Date,
    default: Date.now
  },
  fecha_entrega: {
    type: Date,
    required: true
  },
  direccion_entrega: {
    type: String,
    required: true
  },
  localidad: {
    type: String,
    required: true
  },
  estado: {
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.PENDIENTE
  },
  metodo_pago: {
    type: String,
    required: true
  },
  comentarios: String,
  total: {
    type: Number,
    required: true,
    min: 0
  },
  productos: [OrderProductSchema]
});

const ClientSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  telefono: {
    type: String,
    required: true
  },
  direccion: {
    type: String,
    required: true
  },
  fecha_alta: {
    type: Date,
    default: Date.now
  },
  pedidos: [OrderSchema]
});

export const Client = mongoose.model<IClient>('Client', ClientSchema);