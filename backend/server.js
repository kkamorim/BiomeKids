const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');
const { apiLimiter } = require('./src/middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 3001;

// ==============================================================================
// 1. MIDDLEWARES DE SEGURANÇA E INFRAESTRUTURA
// ==============================================================================

// Helmet: Adiciona cabeçalhos HTTP de segurança contra ataques comuns (XSS, Clickjacking, MIME-sniffing)
app.use(helmet());

// CORS: Permite que o aplicativo React Native se comunique com a API
app.use(
  cors({
    origin: '*', // Em produção, restrinja para o domínio/origem do seu app
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Morgan: Registra requisições no console durante o desenvolvimento
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Parse de JSON com limite seguro de tamanho de payload
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Rate limiter geral para proteção da infraestrutura
app.use('/api', apiLimiter);

// ==============================================================================
// 2. ROTAS DA API
// ==============================================================================

// Resposta silenciosa para navegadores que buscam favicon.ico
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Rota raiz de boas-vindas
app.get('/', (req, res) => {
  res.status(200).json({
    message: '🦁 Bem-vindo à API do ZooKids!',
    docs: 'Acesse /api/health para status do servidor',
  });
});

// Rota de verificação de integridade (Healthcheck)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'ZooKids Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});


// Registra módulos de rotas
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Tratamento de rota 404 (Não Encontrada)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Rota ${req.method} ${req.originalUrl} não encontrada no servidor ZooKids.`,
  });
});

// ==============================================================================
// 3. TRATAMENTO GLOBAL DE ERROS (Error Handler)
// ==============================================================================
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erro interno no servidor.';

  if (process.env.NODE_ENV !== 'production') {
    console.error('💥 [API Error]:', err);
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ==============================================================================
// 4. INICIALIZAÇÃO DO SERVIDOR
// ==============================================================================
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
🦁 ===================================================
🚀 ZooKids API rodando com sucesso!
🌐 Porta: ${PORT}
📍 URL Local: http://localhost:${PORT}/api/health
🔒 Segurança: Helmet, Rate Limiter, bcrypt (12 rounds) & JWT
📋 LGPD: Trilha de auditoria e anonimização ativa
===================================================
  `);
});

module.exports = app;
