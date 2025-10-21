const express = require('express');
const bookRoutes = require('./routes/books');
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./middlewares/logger');
const cors = require('cors');

const app = express();

// ✅ CONFIGURACIÓN CORS DEFINITIVA
const corsOptions = {
  origin: [
    'https://api-books-inky.vercel.app/',          // Producción
    'http://localhost:3000',               // Desarrollo
    'http://127.0.0.1:3000',               // Desarrollo
    'http://localhost:8000',               // Desarrollo frontend
    'http://127.0.0.1:8000',               // Desarrollo frontend  
    'http://0.0.0.0:8000'                  // Desarrollo frontend
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: false,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(logger);

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
