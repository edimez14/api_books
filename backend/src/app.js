const express = require('express');
const bookRoutes = require('./routes/books');
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./middlewares/logger');
const cors = require('cors');

// Crear aplicación Express
const app = express();

// Configuración específica para GitHub Pages
const corsOptions = {
  origin: [
    'https://edimez14.github.io', // Tu dominio de GitHub Pages
    'http://localhost:3000', // Para desarrollo local
    'http://127.0.0.1:3000', // Para desarrollo local
    'http://0.0.0.0:8000/'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: false, // No necesitas credentials para GitHub Pages
  optionsSuccessStatus: 200
};

// Aplicar CORS
app.use(cors(corsOptions));

// O si quieres ser más restrictivo:
app.use(cors({
  origin: function (origin, callback) {
    // Permitir requests sin 'origin' (como mobile apps o curl)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://tu-usuario.github.io',
      'http://localhost:3000',
      'http://127.0.0.1:3000'
    ];
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

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
