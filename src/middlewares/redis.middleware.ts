import { Request, Response, NextFunction } from 'express';
const redisClient = require('../db/redis');

interface CachedRequest extends Request {
    cachedData?: any;
    params: {
        id?: string;
    }
}

interface CacheData {
    [key: string]: any;
}

type RedisMiddleware = (req: CachedRequest, res: Response, next: NextFunction) => void;

const checkCache = (collection: string): RedisMiddleware => (req: CachedRequest, res: Response, next: NextFunction): void => {
    const id = req.params.id ?? -1;
    const key = `${collection}:${id}`;

    redisClient.get(key).then((data: string | null) => {
        if (data) {
            return res.status(200).json(JSON.parse(data));
        }

        next();
    }).catch((err: Error) => {
        console.error(err);
        next();
    });
};

const deleteCache = (collection: string): RedisMiddleware => (
    req: CachedRequest, 
    res: Response, 
    next: NextFunction
): void => {
    const id = req.params.id ?? -1;

    if (id !== -1) {
        redisClient.keys(`${collection}:${id}:*`)
            .then((keys: string[]): Promise<number> | undefined => {
            if (keys.length > 0) {
                return redisClient.del(keys);
            }
            })
            .catch((error: Error): void => {
            console.error('Error deleting cache keys:', error);
            });
            
        redisClient.del(`${collection}:${id}`)
            .catch((error: Error): void => {
            console.error('Error deleting specific cache:', error);
            });
    }
    
    const listKey = `${collection}:-1`;
    redisClient.del(listKey)
        .catch((error: Error): void => {
            console.error('Error deleting list cache:', error);
        });
    
    next();
};

const saveToCache = (data: CacheData, key: string): void => {
    redisClient.setEx(key, 3600, JSON.stringify(data))
        .catch((error: Error): void => {
            console.error('Error saving to cache:', error);
        });
};

export { checkCache, deleteCache, saveToCache };
