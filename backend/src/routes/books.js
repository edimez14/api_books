const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { validateBook, validateBookUpdate } = require('../middlewares/validation');

// Rutas CRUD para libros
router.get('/', bookController.getAllBooks); // Obtener todos los libros
router.get('/search', bookController.searchBooks); // Búsqueda con filtros
router.get('/:id', bookController.getBookById); // Obtener libro por ID
router.post('/', validateBook, bookController.createBook); // Crear nuevo libro
router.put('/:id', validateBookUpdate, bookController.updateBook); // Actualizar libro
router.delete('/:id', bookController.deleteBook); // Eliminar libro

module.exports = router;
