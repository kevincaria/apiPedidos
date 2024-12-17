import { Request, Response } from 'express';
import { Client } from '../models/client.model';
import { saveToCache } from '../middlewares';

export const ClientsController = {
    getAllClients: async (req: Request, res: Response): Promise<void> => {
        const clients = await Client.find();
        saveToCache(clients, 'clients');
        res.status(200).json(clients);
    },

    getClientById: async (req: Request, res: Response): Promise<void> => {
        const _id = req.params.id;
        const client = await Client.findById(_id);
        if (client) {
            saveToCache(client, `clients:${_id}`);
        }
        res.status(200).json(client);
    },

    createClient: async (req: Request, res: Response): Promise<void> => {
        const newClient = await Client.create(req.body);
        res.status(201).json(newClient);
    },

    deleteClient: async (req: Request, res: Response): Promise<void> => {
        const _id = req.params.id;
        const result = await Client.deleteOne({ _id });
        res.status(200).json({ message: `Filas afectadas: ${result.deletedCount}` });
    },

    updateClient: async (req: Request, res: Response): Promise<void> => {
        const _id = req.params.id;
        const client = await Client.findByIdAndUpdate(_id, req.body, { new: true });
        res.status(200).json(client);
    },

    getClientOrders: async (req: Request, res: Response): Promise<void> => {
        const _id = req.params.id;
        const client = await Client.findById(_id);
        res.status(200).json(client?.pedidos);
    }
};