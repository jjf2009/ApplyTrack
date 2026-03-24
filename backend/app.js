const express = require('express');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const userRoutes = require('./routes/auth.routes');

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use("/api/v1/auth", userRoutes);


app.use(notFound);

app.use(errorHandler);

module.exports = app;
