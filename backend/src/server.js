const app = require('./app');

// Configuración del puerto
const PORT = process.env.PORT || 3000;

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`📚 API de Catálogo de Libros lista para usar`);
  console.log(`📍 Endpoints disponibles:`);
  console.log(`   GET  /api/books`);
  console.log(`   GET  /api/books/:id`);
  console.log(`   POST /api/books`);
  console.log(`   PUT  /api/books/:id`);
  console.log(`   DELETE /api/books/:id`);
  console.log(`   GET  /api/books/search`);
});
