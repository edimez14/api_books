const express = require('express');
const bookRoutes = require('./routes/books');
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./middlewares/logger');

// Crear aplicación Express
const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Manejar preflight requests
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Middlewares globales
app.use(express.json()); // Parsear JSON en el body
app.use(logger); // Middleware de logging personalizado

// Rutas principales
app.use('/api/books', bookRoutes);

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({
    message: '📚 Bienvenido a la API de Catálogo de Libros',
    version: '1.0.0',
    endpoints: {
      getAllBooks: 'GET /api/books',
      getBook: 'GET /api/books/:id',
      createBook: 'POST /api/books',
      updateBook: 'PUT /api/books/:id',
      deleteBook: 'DELETE /api/books/:id',
      searchBooks: 'GET /api/books/search'
    }
  });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: `La ruta ${req.originalUrl} no existe en este servidor`
  });
});

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

module.exports = app;
