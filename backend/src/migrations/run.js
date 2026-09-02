const fs = require('fs');
const path = require('path');
const db = require('../config/database');

async function runMigrations() {
  console.log('🚀 Iniciando execução das migrações do PostgreSQL...');

  try {
    const migrationFilePath = path.join(__dirname, '001_initial_schema.sql');
    const sql = fs.readFileSync(migrationFilePath, 'utf-8');

    // Executa todo o script SQL em uma única transação
    await db.query(sql);

    console.log('✅ Migração 001_initial_schema.sql executada com sucesso!');
    console.log('📋 Tabelas criadas/atualizadas:');
    console.log('   - users (com campos LGPD)');
    console.log('   - refresh_tokens');
    console.log('   - lgpd_consent_log');
    console.log('   - species');
    console.log('   - quizzes');
    console.log('   - user_quiz_progress');
    console.log('   - habitats (com JSONB + Índice GIN)');
    console.log('   - scout_photos');
    console.log('   - badges & user_badges');
    console.log('🏁 Banco de dados do ZooKids pronto para uso!');
  } catch (err) {
    console.error('❌ Erro ao executar migrações:', err.message);
    process.exit(1);
  } finally {
    await db.pool.end();
  }
}

runMigrations();
