const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validate, registerSchema, loginSchema, refreshSchema } = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');

// POST /api/auth/register (com rate limit estrito + validação Zod + auditoria LGPD)
router.post(
  '/register',
  authLimiter,
  validate(registerSchema),
  authController.register
);

// POST /api/auth/login (com rate limit anti brute-force + validação Zod)
router.post(
  '/login',
  authLimiter,
  validate(loginSchema),
  authController.login
);

// POST /api/auth/refresh (renovação silenciosa de tokens)
router.post(
  '/refresh',
  validate(refreshSchema),
  authController.refresh
);

// POST /api/auth/logout (encerramento seguro de sessão)
router.post(
  '/logout',
  authController.logout
);

module.exports = router;
