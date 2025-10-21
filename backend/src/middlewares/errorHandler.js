/**
 * Middleware global para manejo de errores
 * Captura todos los errores y envía respuestas JSON consistentes
 */
const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err);

  // Error de validación de JSON
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      error: 'JSON malformado en el cuerpo de la solicitud'
    });
  }

  // Error del sistema de archivos
  if (err.code && err.code.startsWith('ENOENT')) {
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor al acceder a los datos'
    });
  }

  // Error genérico del servidor
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

module.exports = errorHandler;
