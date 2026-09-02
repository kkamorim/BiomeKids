const { verifyAccessToken } = require('../utils/jwt');
const db = require('../config/database');

/**
 * Middleware de Autenticação JWT
 * Intercepta requisições protegidas, valida o cabeçalho Authorization: Bearer <token>,
 * e injeta os dados do usuário autenticado no objeto req.user.
 */
async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Token de autenticação não fornecido ou em formato inválido.',
      });
    }

    const token = authHeader.split(' ')[1];
    let decoded;

    try {
      decoded = verifyAccessToken(token);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          code: 'TOKEN_EXPIRED',
          error: 'Sua sessão expirou. Por favor, atualize o token ou faça login novamente.',
        });
      }
      return res.status(401).json({
        success: false,
        code: 'TOKEN_INVALID',
        error: 'Token inválido ou adulterado.',
      });
    }

    // Verifica se o usuário ainda existe e não foi desativado (Soft Delete / LGPD)
    const userResult = await db.query(
      'SELECT id, full_name, email, deleted_at FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (userResult.rows.length === 0 || userResult.rows[0].deleted_at !== null) {
      return res.status(401).json({
        success: false,
        error: 'Usuário não encontrado ou conta desativada.',
      });
    }

    // Injeta os dados do usuário na requisição para que os controllers possam usar
    req.user = {
      id: userResult.rows[0].id,
      fullName: userResult.rows[0].full_name,
      email: userResult.rows[0].email,
    };

    next();
  } catch (error) {
    console.error('❌ Erro no middleware de autenticação:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno ao autenticar requisição.',
    });
  }
}

module.exports = {
  authenticate,
};
