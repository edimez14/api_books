// Configuración de la API
const API_BASE_URL = 'http://localhost:3000/api';

// Cliente HTTP para comunicarse con la API
class BookAPI {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    // Manejo genérico de requests
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    // Obtener todos los libros
    async getAllBooks() {
        return this.request('/books');
    }

    // Obtener libro por ID
    async getBookById(id) {
        return this.request(`/books/${id}`);
    }

    // Crear nuevo libro
    async createBook(bookData) {
        return this.request('/books', {
            method: 'POST',
            body: JSON.stringify(bookData)
        });
    }

    // Actualizar libro
    async updateBook(id, bookData) {
        return this.request(`/books/${id}`, {
            method: 'PUT',
            body: JSON.stringify(bookData)
        });
    }

    // Eliminar libro
    async deleteBook(id) {
        return this.request(`/books/${id}`, {
            method: 'DELETE'
        });
    }

    // Buscar libros con filtros
    async searchBooks(filters = {}) {
        const params = new URLSearchParams();
        
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== '' && value !== null && value !== undefined) {
                params.append(key, value);
            }
        });

        const queryString = params.toString();
        const endpoint = queryString ? `/books/search?${queryString}` : '/books/search';
        
        return this.request(endpoint);
    }
}

// Instancia global de la API
const bookAPI = new BookAPI();
