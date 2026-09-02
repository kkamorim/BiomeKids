const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth');

// Todas as rotas de usuário exigem autenticação JWT
router.use(authenticate);

// GET /api/user/profile - Retorna perfil do usuário logado
router.get('/profile', userController.getProfile);

// GET /api/user/my-data - LGPD Art. 18: Exportação de todos os dados do usuário
router.get('/my-data', userController.exportData);

// DELETE /api/user/my-account - LGPD Art. 18: Exclusão e anonimização da conta
router.delete('/my-account', userController.deleteAccount);

module.exports = router;
