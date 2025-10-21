// Manejo de la interfaz de usuario
class BookUI {
    constructor() {
        this.currentBookToDelete = null;
        this.currentSearchPage = 1;
        this.currentSearchFilters = {};
    }

    // Mostrar notificación
    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.classList.remove('hidden');

        // Auto-ocultar después de 5 segundos
        setTimeout(() => {
            this.hideNotification();
        }, 5000);
    }

    hideNotification() {
        const notification = document.getElementById('notification');
        notification.classList.add('hidden');
    }

    // Mostrar/ocultar secciones
    showSection(sectionId) {
        // Ocultar todas las secciones
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Mostrar sección seleccionada
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Actualizar botones de navegación
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        const activeBtn = document.querySelector(`[data-section="${sectionId}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }

    // Renderizar libros en la grilla
    renderBooks(books, containerId = 'books-grid') {
        const container = document.getElementById(containerId);
        
        if (!books || books.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-book"></i>
                    <p>No se encontraron libros</p>
                </div>
            `;
            return;
        }

        container.innerHTML = books.map(book => `
            <div class="book-card" data-book-id="${book.id}">
                <div class="book-header">
                    <h3 class="book-title">${this.escapeHtml(book.title)}</h3>
                    <div class="book-actions">
                        <button class="btn btn-icon btn-secondary edit-book" data-id="${book.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-icon btn-danger delete-book" data-id="${book.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="book-meta">
                    <div class="book-author">
                        <i class="fas fa-user-edit"></i>
                        <span>${this.escapeHtml(book.author)}</span>
                    </div>
                    <div class="book-year">
                        <i class="fas fa-calendar-alt"></i>
                        <span>${book.year}</span>
                    </div>
                    <div class="book-genre">
                        <i class="fas fa-tags"></i>
                        <span class="genre-tag">${this.escapeHtml(book.genre)}</span>
                    </div>
                </div>
            </div>
        `).join('');

        // Agregar event listeners a los botones
        this.attachBookEventListeners(containerId);
    }

    // Renderizar resultados de búsqueda
    renderSearchResults(data, containerId = 'search-results') {
        const container = document.getElementById(containerId);
        const pagination = document.getElementById('pagination');
        
        if (!data.data || data.data.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <p>No se encontraron libros que coincidan con la búsqueda</p>
                </div>
            `;
            pagination.classList.add('hidden');
            return;
        }

        this.renderBooks(data.data, containerId);
        this.updateSearchStats(data.pagination);
        this.renderPagination(data.pagination);
    }

    // Actualizar estadísticas de búsqueda
    updateSearchStats(pagination) {
        const statsElement = document.getElementById('search-stats');
        if (statsElement && pagination) {
            statsElement.textContent = 
                `Mostrando ${pagination.booksPerPage} de ${pagination.totalBooks} libros (Página ${pagination.currentPage} de ${pagination.totalPages})`;
        }
    }

    // Renderizar paginación
    renderPagination(pagination) {
        const paginationElement = document.getElementById('pagination');
        
        if (!pagination || pagination.totalPages <= 1) {
            paginationElement.classList.add('hidden');
            return;
        }

        let paginationHTML = '';
        const { currentPage, totalPages, hasPrevPage, hasNextPage } = pagination;

        // Botón anterior
        paginationHTML += `
            <button class="pagination-btn" ${!hasPrevPage ? 'disabled' : ''} 
                    data-page="${currentPage - 1}">
                <i class="fas fa-chevron-left"></i>
            </button>
        `;

        // Números de página
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
                        data-page="${i}">
                    ${i}
                </button>
            `;
        }

        // Botón siguiente
        paginationHTML += `
            <button class="pagination-btn" ${!hasNextPage ? 'disabled' : ''} 
                    data-page="${currentPage + 1}">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;

        paginationElement.innerHTML = paginationHTML;
        paginationElement.classList.remove('hidden');

        // Agregar event listeners a los botones de paginación
        this.attachPaginationEventListeners();
    }

    // Actualizar estadísticas generales
    updateStats(books) {
        const totalBooks = document.getElementById('total-books');
        const totalAuthors = document.getElementById('total-authors');
        const totalGenres = document.getElementById('total-genres');

        if (totalBooks) totalBooks.textContent = books.length;
        
        if (totalAuthors) {
            const uniqueAuthors = new Set(books.map(book => book.author));
            totalAuthors.textContent = uniqueAuthors.size;
        }
        
        if (totalGenres) {
            const uniqueGenres = new Set(books.map(book => book.genre));
            totalGenres.textContent = uniqueGenres.size;
        }
    }

    // Mostrar modal de edición
    showEditModal(book) {
        document.getElementById('edit-id').value = book.id;
        document.getElementById('edit-title').value = book.title;
        document.getElementById('edit-author').value = book.author;
        document.getElementById('edit-year').value = book.year;
        document.getElementById('edit-genre').value = book.genre;

        // Limpiar errores anteriores
        this.clearFormErrors('edit-book-form');

        const modal = document.getElementById('edit-modal');
        modal.classList.remove('hidden');
    }

    // Mostrar modal de confirmación de eliminación
    showDeleteModal(book) {
        this.currentBookToDelete = book;
        document.getElementById('delete-book-title').textContent = book.title;
        
        const modal = document.getElementById('delete-modal');
        modal.classList.remove('hidden');
    }

    // Ocultar modales
    hideModals() {
        document.getElementById('edit-modal').classList.add('hidden');
        document.getElementById('delete-modal').classList.add('hidden');
        this.currentBookToDelete = null;
    }

    // Limpiar formularios
    clearForm(formId) {
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
            this.clearFormErrors(formId);
        }
    }

    // Limpiar errores de formulario
    clearFormErrors(formId) {
        const form = document.getElementById(formId);
        if (form) {
            form.querySelectorAll('.error-message').forEach(el => {
                el.textContent = '';
            });
            form.querySelectorAll('.error').forEach(el => {
                el.classList.remove('error');
            });
        }
    }

    // Mostrar errores en formulario
    showFormErrors(formId, errors) {
        this.clearFormErrors(formId);
        
        Object.entries(errors).forEach(([field, message]) => {
            const input = document.querySelector(`#${formId} [name="${field}"]`);
            const errorElement = input?.closest('.form-group')?.querySelector('.error-message');
            
            if (input && errorElement) {
                input.classList.add('error');
                errorElement.textContent = Array.isArray(message) ? message[0] : message;
            }
        });
    }

    // Mostrar estado de carga
    showLoading(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="loading">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Cargando...</p>
                </div>
            `;
        }
    }

    // Adjuntar event listeners a los libros
    attachBookEventListeners(containerId = 'books-grid') {
        const container = document.getElementById(containerId);
        
        // Botones de editar
        container.querySelectorAll('.edit-book').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const bookId = btn.dataset.id;
                window.app.editBook(bookId);
            });
        });

        // Botones de eliminar
        container.querySelectorAll('.delete-book').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const bookId = btn.dataset.id;
                window.app.deleteBook(bookId);
            });
        });

        // Click en la tarjeta del libro (para futuras expansiones)
        container.querySelectorAll('.book-card').forEach(card => {
            card.addEventListener('click', () => {
                // Podría expandirse para mostrar más detalles
                console.log('Book card clicked:', card.dataset.bookId);
            });
        });
    }

    // Adjuntar event listeners a la paginación
    attachPaginationEventListeners() {
        document.querySelectorAll('.pagination-btn:not(:disabled)').forEach(btn => {
            btn.addEventListener('click', () => {
                const page = parseInt(btn.dataset.page);
                if (page) {
                    window.app.searchBooks(this.currentSearchFilters, page);
                }
            });
        });
    }

    // Escapar HTML para prevenir XSS
    escapeHtml(unsafe) {
        if (typeof unsafe !== 'string') return unsafe;
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

// Instancia global de la UI
const bookUI = new BookUI();
