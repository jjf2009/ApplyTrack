const express = require('express');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const userRoutes = require('./routes/user.routes');

const app = express();

// Parse JSON bodies
app.use(express.json());

// Health check — always available, no auth needed
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// API routes
app.use('/api/users', userRoutes);

// 404 — must be after all routes
app.use(notFound);

// Global error handler — must be last, needs exactly 4 params
app.use(errorHandler);

module.exports = app;
