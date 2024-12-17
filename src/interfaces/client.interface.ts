import { Types } from 'mongoose';

export interface IClient {
  _id?: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  fecha_alta: Date;
  pedidos?: IOrder[];
}

export interface IOrder {
  _id: Types.ObjectId;
  numero_pedido: number;
  fecha_creacion: Date;
  fecha_entrega: Date;
  direccion_entrega: string;
  localidad: string;
  estado: OrderStatus;
  metodo_pago: string;
  comentarios?: string;
  total: number;
  productos: IOrderProduct[];
}

export interface IOrderProduct {
  producto_id: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export enum OrderStatus {
  PENDIENTE = 'Pendiente',
  EN_CAMINO = 'En camino',
  ENTREGADO = 'Entregado',
  CANCELADO = 'Cancelado'
}