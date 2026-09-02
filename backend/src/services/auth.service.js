const db = require('../config/database');
const { hashPassword, comparePassword } = require('../utils/hash');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashToken,
} = require('../utils/jwt');

class AuthService {
  /**
   * Registra um novo usuário no ZooKids com auditoria LGPD
   */
  async register(data, clientInfo = {}) {
    const { fullName, email, password, birthDate, cep, termsVersion } = data;
    const { ipAddress = null, userAgent = null } = clientInfo;

    // 1. Verifica se já existe um usuário com esse email
    const existing = await db.query(
      'SELECT id, deleted_at FROM users WHERE email = $1',
      [email]
    );

    if (existing.rows.length > 0) {
      if (existing.rows[0].deleted_at === null) {
        const error = new Error('Este e-mail já está cadastrado.');
        error.statusCode = 409;
        throw error;
      }
    }

    // 2. Hash da senha com bcrypt (12 salt rounds)
    const passwordHash = await hashPassword(password);

    // 3. Inicia transação no PostgreSQL para garantir consistência atômica
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');

      // Criação do usuário
      const userInsertQuery = `
        INSERT INTO users (full_name, email, password_hash, birth_date, cep, lgpd_consent_at, lgpd_consent_version)
        VALUES ($1, $2, $3, $4, $5, NOW(), $6)
        RETURNING id, full_name, email, avatar_url, created_at;
      `;
      const userResult = await client.query(userInsertQuery, [
        fullName,
        email,
        passwordHash,
        birthDate || null,
        cep || null,
        termsVersion || '1.0',
      ]);
      const user = userResult.rows[0];

      // Inicialização do Habitat Isométrico com JSONB
      const habitatInsertQuery = `
        INSERT INTO habitats (user_id, grid_data, last_watered_at, last_fed_at)
        VALUES ($1, $2, NOW(), NOW())
      `;
      await client.query(habitatInsertQuery, [
        user.id,
        JSON.stringify({
          tiles: [],
          decorations: [],
          unlockedTerritories: [1],
        }),
      ]);

      // Registro do Consentimento na Trilha de Auditoria LGPD
      const lgpdLogQuery = `
        INSERT INTO lgpd_consent_log (user_id, action, terms_version, ip_address, user_agent, details)
        VALUES ($1, 'CONSENT_GIVEN', $2, $3, $4, $5)
      `;
      await client.query(lgpdLogQuery, [
        user.id,
        termsVersion || '1.0',
        ipAddress,
        userAgent,
        JSON.stringify({
          consentType: 'INITIAL_REGISTRATION',
          timestamp: new Date().toISOString(),
        }),
      ]);

      // Geração dos Tokens JWT
      const tokenPayload = { userId: user.id, email: user.email };
      const accessToken = generateAccessToken(tokenPayload);
      const refreshToken = generateRefreshToken(tokenPayload);

      // Armazenamento seguro do hash SHA-256 do Refresh Token
      const tokenHash = hashToken(refreshToken);
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 dias

      await client.query(
        `INSERT INTO refresh_tokens (user_id, token_hash, device_info, expires_at)
         VALUES ($1, $2, $3, $4)`,
        [user.id, tokenHash, userAgent || 'Mobile Device', expiresAt]
      );

      await client.query('COMMIT');

      return {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          avatarUrl: user.avatar_url,
        },
      };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * Autentica usuário existente com email e senha
   */
  async login(email, password, clientInfo = {}) {
    const { userAgent = null } = clientInfo;

    // Busca usuário pelo email garantindo que não foi deletado (Soft Delete)
    const result = await db.query(
      `SELECT id, full_name, email, password_hash, avatar_url 
       FROM users 
       WHERE email = $1 AND deleted_at IS NULL`,
      [email]
    );

    if (result.rows.length === 0) {
      // Mensagem genérica para prevenir "User Enumeration Attacks"
      const error = new Error('E-mail ou senha incorretos.');
      error.statusCode = 401;
      throw error;
    }

    const user = result.rows[0];

    // Valida o hash da senha
    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      const error = new Error('E-mail ou senha incorretos.');
      error.statusCode = 401;
      throw error;
    }

    // Gera novos tokens
    const tokenPayload = { userId: user.id, email: user.email };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Salva hash do novo Refresh Token
    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await db.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, device_info, expires_at)
       VALUES ($1, $2, $3, $4)`,
      [user.id, tokenHash, userAgent || 'Mobile Device', expiresAt]
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        avatarUrl: user.avatar_url,
      },
    };
  }

  /**
   * Atualização silenciosa de Access Token usando Refresh Token (Rotação de Tokens)
   */
  async refresh(refreshToken, clientInfo = {}) {
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (err) {
      const error = new Error('Refresh token inválido ou expirado.');
      error.statusCode = 401;
      throw error;
    }

    const oldTokenHash = hashToken(refreshToken);

    // Verifica no banco se o token existe, não foi revogado e não expirou
    const tokenResult = await db.query(
      `SELECT id, user_id, revoked_at, expires_at 
       FROM refresh_tokens 
       WHERE token_hash = $1`,
      [oldTokenHash]
    );

    if (tokenResult.rows.length === 0 || tokenResult.rows[0].revoked_at !== null) {
      const error = new Error('Sessão inválida ou revogada. Faça login novamente.');
      error.statusCode = 401;
      throw error;
    }

    const tokenRow = tokenResult.rows[0];
    if (new Date() > new Date(tokenRow.expires_at)) {
      const error = new Error('Sessão expirada. Faça login novamente.');
      error.statusCode = 401;
      throw error;
    }

    // Busca dados do usuário
    const userResult = await db.query(
      `SELECT id, full_name, email, avatar_url 
       FROM users 
       WHERE id = $1 AND deleted_at IS NULL`,
      [tokenRow.user_id]
    );

    if (userResult.rows.length === 0) {
      const error = new Error('Usuário não encontrado.');
      error.statusCode = 401;
      throw error;
    }

    const user = userResult.rows[0];

    // Rotação de Tokens: revoga o token antigo e cria um novo par
    const tokenPayload = { userId: user.id, email: user.email };
    const newAccessToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken(tokenPayload);

    const newTokenHash = hashToken(newRefreshToken);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');

      // Revoga o token anterior
      await client.query(
        'UPDATE refresh_tokens SET revoked_at = NOW() WHERE id = $1',
        [tokenRow.id]
      );

      // Insere o novo token
      await client.query(
        `INSERT INTO refresh_tokens (user_id, token_hash, device_info, expires_at)
         VALUES ($1, $2, $3, $4)`,
        [user.id, newTokenHash, clientInfo.userAgent || 'Mobile Device', expiresAt]
      );

      await client.query('COMMIT');

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          avatarUrl: user.avatar_url,
        },
      };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * Encerra a sessão do usuário revogando o Refresh Token
   */
  async logout(refreshToken, userId) {
    if (refreshToken) {
      const tokenHash = hashToken(refreshToken);
      await db.query(
        'UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = $1',
        [tokenHash]
      );
    } else if (userId) {
      // Se não enviou o token específico, revoga todas as sessões do usuário
      await db.query(
        'UPDATE refresh_tokens SET revoked_at = NOW() WHERE user_id = $1 AND revoked_at IS NULL',
        [userId]
      );
    }
    return { message: 'Sessão encerrada com sucesso.' };
  }
}

module.exports = new AuthService();
