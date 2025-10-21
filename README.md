# 📚 Biblioteca Digital - Proyecto Completo

## 🏗️ Estructura del Proyecto

```
biblioteca-digital/
├── backend/                 # API REST con Node.js y Express
│   ├── src/
│   │   ├── controllers/
│   │   ├── data/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── README.md
└── frontend/                # Interfaz web moderna
    ├── css/
    ├── js/
    ├── index.html
    └── README.md
```

---

# 🔙 BACKEND - API de Libros

## 📋 Descripción
API REST completa para gestión de catálogo de libros construida con Node.js y Express. Incluye operaciones CRUD, búsqueda avanzada, validaciones y persistencia en JSON.

## 🚀 Características

- ✅ **CRUD Completo** para libros
- 🔍 **Búsqueda avanzada** con filtros y paginación
- 🛡️ **Validación de datos** robusta
- 📝 **Logging** de requests
- 🎯 **Manejo de errores** centralizado
- 💾 **Persistencia** en archivo JSON
- 🌐 **Soporte CORS** para frontend

## 📦 Instalación

```bash
# Clonar o navegar al directorio backend
cd backend

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Ejecutar en producción
npm start
```

## 🛠️ Dependencias

```json
{
  "express": "^4.18.2",
  "cors": "^2.8.5"
}
```

## 🔌 Endpoints de la API

### 📚 Libros

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/books` | Obtener todos los libros |
| `GET` | `/api/books/:id` | Obtener libro por ID |
| `POST` | `/api/books` | Crear nuevo libro |
| `PUT` | `/api/books/:id` | Actualizar libro existente |
| `DELETE` | `/api/books/:id` | Eliminar libro |
| `GET` | `/api/books/search` | Búsqueda con filtros |

### 🔍 Búsqueda Avanzada

Parámetros para `/api/books/search`:
- `?author=nombre` - Filtrar por autor
- `?genre=género` - Filtrar por género
- `?limit=10` - Límite de resultados (default: 10)
- `?page=1` - Paginación (default: 1)

## 📝 Ejemplos de Uso

### Obtener todos los libros
```bash
curl http://localhost:3000/api/books
```

### Crear un libro
```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Cien años de soledad",
    "author": "Gabriel García Márquez",
    "year": 1967,
    "genre": "Realismo mágico"
  }'
```

### Buscar libros
```bash
curl "http://localhost:3000/api/books/search?author=Gabriel&limit=5"
```

## 🏗️ Estructura del Código

```
src/
├── controllers/
│   └── bookController.js    # Lógica de negocio
├── middlewares/
│   ├── errorHandler.js      # Manejo de errores
│   ├── logger.js           # Logging de requests
│   └── validation.js       # Validación de datos
├── routes/
│   └── books.js            # Definición de rutas
├── data/
│   └── books.json          # Base de datos JSON
├── app.js                  # Configuración de Express
└── server.js               # Punto de entrada
```

## ⚙️ Configuración

El servidor se ejecuta en el puerto 3000 por defecto. Para cambiar:

```bash
# Variable de entorno
export PORT=4000
npm start
```

## 🐛 Solución de Problemas

### Error CORS
Si el frontend no puede conectar, verificar que CORS esté habilitado:

```javascript
// En app.js
app.use(cors({
    origin: ['http://localhost:8000', 'http://127.0.0.1:8000']
}));
```

### Puerto ocupado
```bash
# Verificar puerto 3000
lsof -i :3000
# O usar otro puerto
PORT=4000 npm start
```

---

# 🎨 FRONTEND - Interfaz Web

## 📋 Descripción
Interfaz web moderna y responsive para gestionar el catálogo de libros. Desarrollada con HTML5, CSS3 y JavaScript vanilla.

## 🎯 Características

- 🎨 **Diseño moderno** con gradientes y glassmorphism
- 📱 **Completamente responsive** (mobile, tablet, desktop)
- ⚡ **Interfaz dinámica** sin recargas de página
- 🔍 **Búsqueda en tiempo real** con filtros
- 📊 **Estadísticas visuales** del catálogo
- 🛡️ **Validación de formularios** en frontend
- 📝 **Notificaciones** de estado
- 🎪 **Animaciones y transiciones** suaves

## 🚀 Instalación y Uso

```bash
# Navegar al directorio frontend
cd frontend

# Servir con Python
python -m http.server 8000

# O con Node.js (si tienes http-server)
npx http-server -p 8000

# Abrir en navegador
http://localhost:8000
```

## 🏗️ Estructura de Archivos

```
frontend/
├── index.html              # Página principal
├── css/
│   ├── style.css          # Estilos principales
│   └── responsive.css     # Media queries
└── js/
    ├── app.js             # Aplicación principal
    ├── api.js             # Cliente HTTP para API
    └── ui.js              # Manipulación del DOM
```

## 🎨 Características de Diseño

### Paleta de Colores
```css
:root {
    --primary-color: #4361ee;
    --secondary-color: #7209b7;
    --success-color: #4cc9f0;
    --danger-color: #f72585;
    --dark-color: #2b2d42;
}
```

### Layout
- **Header**: Navegación con tabs
- **Main**: Secciones dinámicas
- **Modals**: Para editar/eliminar
- **Footer**: Información básica

## ⚡ Funcionalidades

### 📚 Catálogo
- Vista de todos los libros en grid responsivo
- Tarjetas con información completa
- Botones de acción (editar/eliminar)
- Estadísticas en tiempo real

### ➕ Agregar Libros
- Formulario con validación
- Campos: título, autor, año, género
- Select de géneros predefinidos
- Validación en tiempo real

### 🔍 Búsqueda
- Filtros por autor y género
- Paginación de resultados
- Límite de resultados personalizable
- Estadísticas de búsqueda

## 🔧 Configuración

### URL del Backend
En `js/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

### Personalización
- Modificar colores en `css/style.css` (variables CSS)
- Agregar nuevos géneros en los selects del HTML
- Ajustar breakpoints en `css/responsive.css`

## 🎯 Navegación

1. **Catálogo**: Vista principal con todos los libros
2. **Agregar Libro**: Formulario de creación
3. **Buscar**: Búsqueda con filtros avanzados

## 📱 Compatibilidad

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Dispositivos móviles

## 🐛 Solución de Problemas Comunes

### No se cargan los libros
1. Verificar que el backend esté ejecutándose
2. Revisar la consola del navegador (F12)
3. Comprobar URL de la API en `api.js`

### Errores de CORS
1. Asegurarse que el backend tenga CORS habilitado
2. Verificar que los puertos coincidan

### Diseño no se ve bien
1. Limpiar cache del navegador (Ctrl+F5)
2. Verificar que todos los archivos CSS/JS se carguen

## 🚀 Despliegue

### Desarrollo Local
```bash
python -m http.server 8000
```

### Producción
Subir archivos a cualquier servicio de hosting estático:
- Netlify
- Vercel
- GitHub Pages
- Servidor web tradicional (Apache/Nginx)

---

# 🎯 Uso Completo del Sistema

## 1. Iniciar Backend
```bash
cd backend
npm install
npm run dev
```

## 2. Iniciar Frontend
```bash
cd frontend
python -m http.server 8000
```

## 3. Acceder a la Aplicación
Abrir `http://localhost:8000` en el navegador.

## 📞 Soporte

Si encuentras problemas:
1. Revisa la consola del navegador (F12)
2. Verifica que ambos servidores estén corriendo
3. Comprueba que no haya errores en la terminal

---

**¡Disfruta gestionando tu biblioteca digital! 📚✨**