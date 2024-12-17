import { Router } from 'express';
import { ClientsController } from '../controllers/clients.controller';
import { validateId, checkCache, deleteCache } from '../middlewares';
import { Client } from '../models/client.model';

const router = Router();

router.get('/clientes',
    checkCache('clients'),
    ClientsController.getAllClients
);

router.get('/clientes/:id',
    checkCache('clients'),
    validateId(Client),
    ClientsController.getClientById
);

router.post('/clientes',
    deleteCache('clients'),
    ClientsController.createClient
);

router.delete('/clientes/:id',
    validateId(Client),
    deleteCache('clients'),
    ClientsController.deleteClient
);

router.put('/clientes/:id',
    validateId(Client),
    deleteCache('clients'),
    ClientsController.updateClient
);

export default router;
