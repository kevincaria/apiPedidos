import { Request, Response, NextFunction, RequestHandler } from 'express';
import { Model as MongooseModel, Document, Types } from 'mongoose';
import { IClient } from '../interfaces/client.interface';

interface BaseDocument extends Document {
  _id: Types.ObjectId;
  componentes?: Types.DocumentArray<Document>;
  [key: string]: any;
}

type GenericMiddleware = (req: Request, res: Response, next: NextFunction) => Promise<void | Response>;

const requestTime: RequestHandler = (req, _, next) => {
    console.log({ 
        url: req.url, 
        method: req.method, 
        fechaHora: new Date() 
    });
    next();
};

const validateId = (Model: MongooseModel<any>): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            const _id = req.params.id;

            if (!Types.ObjectId.isValid(_id)) {
                res.status(400).send('ID no válido');
                return;
            }

            Model.findById(_id).then(model => {
                if (!model) {
                    res.status(404).send(`${Model.modelName} no encontrado`);
                    return;
                }
                next();
            }).catch(error => {
                next(error);
            });
        } catch (error) {
            next(error);
        }
    };
};

const validateComponentId = (Model: MongooseModel<BaseDocument>): GenericMiddleware => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    const { id, componenteId } = req.params;

    if (!id || !componenteId) {
      return res.status(400).send('ID no válido');
    }

    try {
      const producto = await Model.findById(id);
      const componente = producto?.componentes?.id(componenteId);

      if (!componente) {
        return res.status(404).send('Componente no encontrado');
      }

      next();
    } catch (error) {
      return res.status(500).send('Error al validar componente');
    }
  };
};

const validateOrderId = (Model: MongooseModel<IClient>): GenericMiddleware => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    const { id, orderId } = req.params;

    if (!id || !orderId) {
      return res.status(400).send('IDs del cliente o pedido no válidos');
    }

    try {
      const client = await Model.findById(id);
      const order = client?.pedidos?.find(pedido => pedido._id.toString() === orderId);

      if (!order) {
        return res.status(404).send('Pedido no encontrado');
      }

      next();
    } catch (error) {
      return res.status(500).send('Error al validar pedido');
    }
  };
};

const validateAssociationsById = (
  Model: MongooseModel<BaseDocument>,
  throughModel: MongooseModel<BaseDocument>
): GenericMiddleware => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    const { id } = req.params;

    try {
      const instance = await Model.findById(id).populate(
        throughModel.modelName.toLowerCase() + 's'
      );

      const associations = instance?.[throughModel.modelName.toLowerCase() + 's'] || [];
      
      if (associations.length > 0) {
        return res.status(500).json({
          mensaje: `No se puede eliminar el ${Model.modelName} porque tiene registros asociados en ${throughModel.modelName}.`
        });
      }

      next();
    } catch (error) {
      return res.status(500).send('Error al validar asociaciones');
    }
  };
};

export { requestTime, validateId, validateComponentId, validateOrderId, validateAssociationsById };