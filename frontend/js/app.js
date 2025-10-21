// Aplicación principal
class BookApp {
    constructor() {
        this.ui = bookUI;
        this.api = bookAPI;
        this.books = [];
        this.init();
    }

    // Inicializar la aplicación
    init() {
        this.bindEvents();
        this.loadBooks();
        this.showSection('catalog');
    }

    // Vincular eventos
    bindEvents() {
        // Navegación
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.showSection(section);
            });
        });

        // Formulario de agregar libro
        document.getElementById('add-book-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createBook();
        });

        // Formulario de editar libro
        document.getElementById('edit-book-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateBook();
        });

        // Formulario de búsqueda
        document.getElementById('search-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSearch();
        });

        // Botón de limpiar búsqueda
        document.getElementById('clear-search').addEventListener('click', () => {
            this.clearSearch();
        });

        // Botón de actualizar
        document.getElementById('refresh-btn').addEventListener('click', () => {
            this.loadBooks();
        });

        // Cerrar modales
        document.getElementById('close-edit-modal').addEventListener('click', () => {
            this.ui.hideModals();
        });

        document.getElementById('close-delete-modal').addEventListener('click', () => {
            this.ui.hideModals();
        });

        document.getElementById('cancel-edit').addEventListener('click', () => {
            this.ui.hideModals();
        });

        document.getElementById('cancel-delete').addEventListener('click', () => {
            this.ui.hideModals();
        });

        // Confirmar eliminación
        document.getElementById('confirm-delete').addEventListener('click', () => {
            this.confirmDelete();
        });

        // Cerrar modales al hacer click fuera
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.ui.hideModals();
                }
            });
        });

        // Manejar tecla Escape para cerrar modales
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.ui.hideModals();
            }
        });
    }

    // Mostrar sección
    showSection(sectionId) {
        this.ui.showSection(sectionId);
        
        // Acciones específicas por sección
        switch(sectionId) {
            case 'catalog':
                this.loadBooks();
                break;
            case 'search':
                this.clearSearch();
                break;
        }
    }

    // Cargar todos los libros
    async loadBooks() {
        try {
            this.ui.showLoading('books-grid');
            
            const response = await this.api.getAllBooks();
            this.books = response.data || [];
            
            this.ui.renderBooks(this.books);
            this.ui.updateStats(this.books);
            
        } catch (error) {
            console.error('Error loading books:', error);
            this.ui.showNotification('Error al cargar los libros: ' + error.message, 'error');
            
            // Mostrar estado de error
            document.getElementById('books-grid').innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Error al cargar los libros</p>
                    <button class="btn btn-secondary mt-2" onclick="window.app.loadBooks()">
                        Reintentar
                    </button>
                </div>
            `;
        }
    }

    // Crear nuevo libro
    async createBook() {
        const form = document.getElementById('add-book-form');
        const formData = new FormData(form);
        
        const bookData = {
            title: formData.get('title').trim(),
            author: formData.get('author').trim(),
            year: parseInt(formData.get('year')),
            genre: formData.get('genre')
        };

        try {
            // Validación básica del frontend
            const errors = this.validateBook(bookData);
            if (Object.keys(errors).length > 0) {
                this.ui.showFormErrors('add-book-form', errors);
                return;
            }

            this.ui.clearFormErrors('add-book-form');
            
            const response = await this.api.createBook(bookData);
            
            this.ui.showNotification('Libro creado exitosamente');
            this.ui.clearForm('add-book-form');
            this.loadBooks(); // Recargar la lista
            
            // Cambiar a la sección del catálogo
            this.showSection('catalog');
            
        } catch (error) {
            console.error('Error creating book:', error);
            
            // Manejar errores de validación del backend
            if (error.message.includes('validación')) {
                try {
                    const errorData = JSON.parse(error.message);
                    if (errorData.details) {
                        const errors = {};
                        errorData.details.forEach(detail => {
                            if (detail.includes('título')) errors.title = detail;
                            else if (detail.includes('autor')) errors.author = detail;
                            else if (detail.includes('año')) errors.year = detail;
                            else if (detail.includes('género')) errors.genre = detail;
                        });
                        this.ui.showFormErrors('add-book-form', errors);
                    }
                } catch {
                    this.ui.showNotification('Error al crear el libro: ' + error.message, 'error');
                }
            } else {
                this.ui.showNotification('Error al crear el libro: ' + error.message, 'error');
            }
        }
    }

    // Editar libro (mostrar modal)
    async editBook(bookId) {
        try {
            const response = await this.api.getBookById(bookId);
            this.ui.showEditModal(response.data);
        } catch (error) {
            console.error('Error loading book for edit:', error);
            this.ui.showNotification('Error al cargar el libro: ' + error.message, 'error');
        }
    }

    // Actualizar libro
    async updateBook() {
        const form = document.getElementById('edit-book-form');
        const formData = new FormData(form);
        const bookId = formData.get('id');
        
        const bookData = {
            title: formData.get('title').trim(),
            author: formData.get('author').trim(),
            year: parseInt(formData.get('year')),
            genre: formData.get('genre')
        };

        try {
            // Validación básica del frontend
            const errors = this.validateBook(bookData);
            if (Object.keys(errors).length > 0) {
                this.ui.showFormErrors('edit-book-form', errors);
                return;
            }

            this.ui.clearFormErrors('edit-book-form');
            
            await this.api.updateBook(bookId, bookData);
            
            this.ui.showNotification('Libro actualizado exitosamente');
            this.ui.hideModals();
            this.loadBooks(); // Recargar la lista
            
        } catch (error) {
            console.error('Error updating book:', error);
            
            // Manejar errores de validación del backend
            if (error.message.includes('validación')) {
                try {
                    const errorData = JSON.parse(error.message);
                    if (errorData.details) {
                        const errors = {};
                        errorData.details.forEach(detail => {
                            if (detail.includes('título')) errors.title = detail;
                            else if (detail.includes('autor')) errors.author = detail;
                            else if (detail.includes('año')) errors.year = detail;
                            else if (detail.includes('género')) errors.genre = detail;
                        });
                        this.ui.showFormErrors('edit-book-form', errors);
                    }
                } catch {
                    this.ui.showNotification('Error al actualizar el libro: ' + error.message, 'error');
                }
            } else {
                this.ui.showNotification('Error al actualizar el libro: ' + error.message, 'error');
            }
        }
    }

    // Eliminar libro (mostrar confirmación)
    async deleteBook(bookId) {
        try {
            const response = await this.api.getBookById(bookId);
            this.ui.showDeleteModal(response.data);
        } catch (error) {
            console.error('Error loading book for deletion:', error);
            this.ui.showNotification('Error al cargar el libro: ' + error.message, 'error');
        }
    }

    // Confirmar eliminación
    async confirmDelete() {
        if (!this.ui.currentBookToDelete) return;

        try {
            await this.api.deleteBook(this.ui.currentBookToDelete.id);
            
            this.ui.showNotification('Libro eliminado exitosamente');
            this.ui.hideModals();
            this.loadBooks(); // Recargar la lista
            
        } catch (error) {
            console.error('Error deleting book:', error);
            this.ui.showNotification('Error al eliminar el libro: ' + error.message, 'error');
        }
    }

    // Manejar búsqueda
    async handleSearch() {
        const form = document.getElementById('search-form');
        const formData = new FormData(form);
        
        const filters = {
            author: formData.get('author').trim(),
            genre: formData.get('genre'),
            limit: formData.get('limit'),
            page: '1' // Siempre empezar en página 1
        };

        this.ui.currentSearchFilters = filters;
        await this.searchBooks(filters, 1);
    }

    // Buscar libros
    async searchBooks(filters = {}, page = 1) {
        try {
            this.ui.showLoading('search-results');
            
            const searchFilters = { ...filters, page: page.toString() };
            const response = await this.api.searchBooks(searchFilters);
            
            this.ui.renderSearchResults(response);
            
        } catch (error) {
            console.error('Error searching books:', error);
            this.ui.showNotification('Error al buscar libros: ' + error.message, 'error');
            
            // Mostrar estado de error
            document.getElementById('search-results').innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Error al realizar la búsqueda</p>
                    <button class="btn btn-secondary mt-2" onclick="window.app.handleSearch()">
                        Reintentar
                    </button>
                </div>
            `;
        }
    }

    // Limpiar búsqueda
    clearSearch() {
        this.ui.clearForm('search-form');
        this.ui.currentSearchFilters = {};
        
        document.getElementById('search-results').innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <p>Realiza una búsqueda para ver los resultados</p>
            </div>
        `;
        
        document.getElementById('pagination').classList.add('hidden');
        document.getElementById('search-stats').textContent = '';
    }

    // Validar datos del libro
    validateBook(bookData) {
        const errors = {};

        if (!bookData.title || bookData.title.trim() === '') {
            errors.title = 'El título es obligatorio';
        }

        if (!bookData.author || bookData.author.trim() === '') {
            errors.author = 'El autor es obligatorio';
        }

        if (!bookData.year || isNaN(bookData.year) || bookData.year < 1000 || bookData.year > 2030) {
            errors.year = 'El año debe ser un número entre 1000 y 2030';
        }

        if (!bookData.genre) {
            errors.genre = 'El género es obligatorio';
        }

        return errors;
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.app = new BookApp();
});

// Manejar errores no capturados
window.addEventListener('error', (event) => {
    console.error('Error no capturado:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Promise rechazada no manejada:', event.reason);
});
