const rateLimit = require('express-rate-limit');

// Limitador estrito para rotas de autenticação (Login e Cadastro)
// Previne ataques de força bruta (Brute-Force) e enumeração de emails
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Janela de 15 minutos
  max: 15, // Máximo de 15 tentativas por IP dentro do intervalo
  standardHeaders: true, // Retorna cabeçalhos padrão `RateLimit-*`
  legacyHeaders: false, // Desabilita cabeçalhos legados `X-RateLimit-*`
  message: {
    success: false,
    error: 'Muitas tentativas a partir deste IP. Por favor, tente novamente após 15 minutos.',
  },
});

// Limitador geral para todas as outras rotas da API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200, // Máximo de 200 requisições por 15 minutos
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Limite de requisições excedido. Reduza o ritmo e tente novamente em instantes.',
  },
});

module.exports = {
  authLimiter,
  apiLimiter,
};
