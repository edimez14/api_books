/**
 * Middleware para validar datos al crear un libro
 */
const validateBook = (req, res, next) => {
  const { title, author, year, genre } = req.body;
  const errors = [];

  // Validar campos requeridos
  if (!title || title.trim() === '') {
    errors.push('El título es obligatorio');
  }

  if (!author || author.trim() === '') {
    errors.push('El autor es obligatorio');
  }

  if (!year) {
    errors.push('El año es obligatorio');
  } else if (isNaN(year) || parseInt(year) < 0) {
    errors.push('El año debe ser un número positivo');
  }

  if (!genre || genre.trim() === '') {
    errors.push('El género es obligatorio');
  }

  // Si hay errores, retornar respuesta de error
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Datos de validación inválidos',
      details: errors
    });
  }

  next();
};

/**
 * Middleware para validar datos al actualizar un libro
 */
const validateBookUpdate = (req, res, next) => {
  const { title, author, year, genre } = req.body;
  const errors = [];

  // Validar que al menos un campo sea proporcionado
  if (!title && !author && !year && !genre) {
    return res.status(400).json({
      success: false,
      error: 'Se debe proporcionar al menos un campo para actualizar (title, author, year, genre)'
    });
  }

  // Validar tipos de datos si se proporcionan
  if (year && (isNaN(year) || parseInt(year) < 0)) {
    errors.push('El año debe ser un número positivo');
  }

  if (title && title.trim() === '') {
    errors.push('El título no puede estar vacío');
  }

  if (author && author.trim() === '') {
    errors.push('El autor no puede estar vacío');
  }

  if (genre && genre.trim() === '') {
    errors.push('El género no puede estar vacío');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Datos de validación inválidos',
      details: errors
    });
  }

  next();
};

module.exports = {
  validateBook,
  validateBookUpdate
};
