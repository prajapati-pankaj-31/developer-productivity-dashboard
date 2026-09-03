import app from './app.js';

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const API_PREFIX = process.env.API_PREFIX || '/api/v1';

const server = app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 Developer Productivity Dashboard REST API`);
  console.log(`⚡ Environment : ${NODE_ENV}`);
  console.log(`🌐 Server Port : http://localhost:${PORT}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  console.log(`📡 API Base    : http://localhost:${PORT}${API_PREFIX}`);
  console.log(`=================================================`);
});

// Graceful Shutdown
const handleShutdown = (signal: string) => {
  console.log(`\n[${signal}] Shutting down REST API server gracefully...`);
  server.close(() => {
    console.log('HTTP server closed. Exiting process.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));
