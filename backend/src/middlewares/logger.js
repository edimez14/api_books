/**
 * Middleware de logging personalizado
 * Registra información sobre cada request en la consola
 */
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
  
  // Si hay body (POST, PUT), loggear información relevante (sin datos sensibles)
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`[${timestamp}] Body:`, JSON.stringify(req.body));
  }
  
  next();
};

module.exports = logger;
