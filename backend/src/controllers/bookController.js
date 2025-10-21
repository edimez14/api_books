const fs = require('fs').promises;
const path = require('path');

// Ruta del archivo JSON para persistencia
const DATA_FILE = path.join(__dirname, '../data/books.json');

/**
 * Utilidad para leer libros desde el archivo JSON
 */
const readBooksFromFile = async () => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // Si el archivo no existe, retornar array vacío
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
};

/**
 * Utilidad para guardar libros en el archivo JSON
 */
const saveBooksToFile = async (books) => {
  await fs.writeFile(DATA_FILE, JSON.stringify(books, null, 2), 'utf8');
};

/**
 * Generar un nuevo ID único para un libro
 */
const generateNewId = (books) => {
  if (books.length === 0) return 1;
  return Math.max(...books.map(book => book.id)) + 1;
};

// Controlador para obtener todos los libros
const getAllBooks = async (req, res, next) => {
  try {
    const books = await readBooksFromFile();
    
    res.json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    next(error);
  }
};

// Controlador para obtener un libro por ID
const getBookById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const books = await readBooksFromFile();
    const book = books.find(b => b.id === parseInt(id));

    if (!book) {
      return res.status(404).json({
        success: false,
        error: `Libro con ID ${id} no encontrado`
      });
    }

    res.json({
      success: true,
      data: book
    });
  } catch (error) {
    next(error);
  }
};

// Controlador para crear un nuevo libro
const createBook = async (req, res, next) => {
  try {
    const { title, author, year, genre } = req.body;
    const books = await readBooksFromFile();
    
    // Crear nuevo libro
    const newBook = {
      id: generateNewId(books),
      title,
      author,
      year: parseInt(year),
      genre,
      createdAt: new Date().toISOString()
    };

    books.push(newBook);
    await saveBooksToFile(books);

    res.status(201).json({
      success: true,
      message: 'Libro creado exitosamente',
      data: newBook
    });
  } catch (error) {
    next(error);
  }
};

// Controlador para actualizar un libro
const updateBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const books = await readBooksFromFile();
    const bookIndex = books.findIndex(b => b.id === parseInt(id));

    if (bookIndex === -1) {
      return res.status(404).json({
        success: false,
        error: `Libro con ID ${id} no encontrado`
      });
    }

    // Actualizar libro manteniendo el ID y fecha de creación
    const updatedBook = {
      ...books[bookIndex],
      ...updates,
      id: books[bookIndex].id, // Mantener ID original
      createdAt: books[bookIndex].createdAt, // Mantener fecha creación
      updatedAt: new Date().toISOString() // Agregar fecha de actualización
    };

    books[bookIndex] = updatedBook;
    await saveBooksToFile(books);

    res.json({
      success: true,
      message: 'Libro actualizado exitosamente',
      data: updatedBook
    });
  } catch (error) {
    next(error);
  }
};

// Controlador para eliminar un libro
const deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const books = await readBooksFromFile();
    const bookIndex = books.findIndex(b => b.id === parseInt(id));

    if (bookIndex === -1) {
      return res.status(404).json({
        success: false,
        error: `Libro con ID ${id} no encontrado`
      });
    }

    const deletedBook = books.splice(bookIndex, 1)[0];
    await saveBooksToFile(books);

    res.json({
      success: true,
      message: 'Libro eliminado exitosamente',
      data: deletedBook
    });
  } catch (error) {
    next(error);
  }
};

// Controlador para búsqueda con filtros y paginación
const searchBooks = async (req, res, next) => {
  try {
    const { author, genre, limit, page } = req.query;
    let books = await readBooksFromFile();

    // Aplicar filtros
    if (author) {
      books = books.filter(book => 
        book.author.toLowerCase().includes(author.toLowerCase())
      );
    }

    if (genre) {
      books = books.filter(book => 
        book.genre.toLowerCase().includes(genre.toLowerCase())
      );
    }

    // Paginación
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    const startIndex = (pageNumber - 1) * limitNumber;
    const endIndex = startIndex + limitNumber;

    // Validar parámetros de paginación
    if (pageNumber < 1 || limitNumber < 1) {
      return res.status(400).json({
        success: false,
        error: 'Los parámetros page y limit deben ser números positivos'
      });
    }

    const paginatedBooks = books.slice(startIndex, endIndex);
    const totalPages = Math.ceil(books.length / limitNumber);

    res.json({
      success: true,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        totalBooks: books.length,
        booksPerPage: limitNumber,
        hasNextPage: endIndex < books.length,
        hasPrevPage: startIndex > 0
      },
      data: paginatedBooks
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  searchBooks
};
