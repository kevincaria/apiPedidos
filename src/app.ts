require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT;
const mongoDb = require('./db/mongo');
const redis = require('./db/redis');

app.listen(PORT, async () => {
    await mongoDb.connect();
    await redis.connect();
    console.log(`Server is running on port ${PORT}`);
});