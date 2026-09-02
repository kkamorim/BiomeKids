const db = require('../config/database');

class UserService {
  /**
   * Obtém os dados do perfil do usuário
   */
  async getProfile(userId) {
    const query = `
      SELECT id, full_name, email, birth_date, cep, avatar_url, created_at, lgpd_consent_at
      FROM users
      WHERE id = $1 AND deleted_at IS NULL
    `;
    const result = await db.query(query, [userId]);

    if (result.rows.length === 0) {
      const error = new Error('Usuário não encontrado.');
      error.statusCode = 404;
      throw error;
    }

    return result.rows[0];
  }

  /**
   * LGPD - Direito de Acesso e Portabilidade dos Dados (Art. 18, II e V da LGPD)
   * Exporta todo o dossiê de dados armazenados do usuário em formato JSON estruturado.
   */
  async exportMyData(userId, clientInfo = {}) {
    // 1. Dados cadastrais
    const userResult = await db.query(
      `SELECT id, full_name, email, birth_date, cep, avatar_url, created_at, lgpd_consent_at, lgpd_consent_version
       FROM users WHERE id = $1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      const error = new Error('Usuário não encontrado.');
      error.statusCode = 404;
      throw error;
    }

    // 2. Progresso de Quizzes
    const quizResult = await db.query(
      `SELECT q.title, q.territorio_id, uqp.score, uqp.completed, uqp.completed_at
       FROM user_quiz_progress uqp
       JOIN quizzes q ON q.id = uqp.quiz_id
       WHERE uqp.user_id = $1`,
      [userId]
    );

    // 3. Habitat Isométrico
    const habitatResult = await db.query(
      `SELECT grid_data, last_watered_at, last_fed_at, updated_at
       FROM habitats WHERE user_id = $1`,
      [userId]
    );

    // 4. Selos e Conquistas
    const badgesResult = await db.query(
      `SELECT b.name, b.description, ub.unlocked_at
       FROM user_badges ub
       JOIN badges b ON b.id = ub.badge_id
       WHERE ub.user_id = $1`,
      [userId]
    );

    // 5. Histórico de Consentimento LGPD
    const consentResult = await db.query(
      `SELECT action, terms_version, created_at
       FROM lgpd_consent_log WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );

    // Registra na auditoria que os dados foram exportados
    await db.query(
      `INSERT INTO lgpd_consent_log (user_id, action, terms_version, ip_address, user_agent, details)
       VALUES ($1, 'DATA_EXPORTED', '1.0', $2, $3, $4)`,
      [
        userId,
        clientInfo.ipAddress || null,
        clientInfo.userAgent || null,
        JSON.stringify({ exportedAt: new Date().toISOString() }),
      ]
    );

    return {
      exportedAt: new Date().toISOString(),
      legalNotice: 'Relatório gerado em conformidade com o Artigo 18 da Lei Geral de Proteção de Dados (LGPD).',
      userData: userResult.rows[0],
      quizProgress: quizResult.rows,
      habitat: habitatResult.rows[0] || null,
      badges: badgesResult.rows,
      consentHistory: consentResult.rows,
    };
  }

  /**
   * LGPD - Direito à Eliminação dos Dados Pessoais (Art. 18, VI da LGPD)
   * Executa Soft Delete, anonimiza dados identificáveis e revoga todas as sessões.
   */
  async deleteAccount(userId, clientInfo = {}) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Anonimiza os dados sensíveis e marca deleted_at
      const anonymizedEmail = `anon_${userId.substring(0, 8)}@deleted.zookids.app`;
      const anonymizedName = 'Usuário Anonimizado';

      await client.query(
        `UPDATE users
         SET full_name = $1,
             email = $2,
             password_hash = 'DELETED',
             birth_date = NULL,
             cep = NULL,
             avatar_url = NULL,
             deleted_at = NOW(),
             updated_at = NOW()
         WHERE id = $3`,
        [anonymizedName, anonymizedEmail, userId]
      );

      // 2. Revoga todos os tokens de sessão ativos
      await client.query(
        'UPDATE refresh_tokens SET revoked_at = NOW() WHERE user_id = $1',
        [userId]
      );

      // 3. Registra na trilha de auditoria
      await client.query(
        `INSERT INTO lgpd_consent_log (user_id, action, terms_version, ip_address, user_agent, details)
         VALUES ($1, 'ACCOUNT_DELETED', '1.0', $2, $3, $4)`,
        [
          userId,
          clientInfo.ipAddress || null,
          clientInfo.userAgent || null,
          JSON.stringify({
            deletedAt: new Date().toISOString(),
            status: 'ANONYMIZED_AND_DEACTIVATED',
          }),
        ]
      );

      await client.query('COMMIT');
      return { success: true, message: 'Conta anonimizada e excluída em conformidade com a LGPD.' };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}

module.exports = new UserService();
