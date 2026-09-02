const { Pool } = require('pg');
require('dotenv').config();

// Pool de conexões do PostgreSQL:
// Reutiliza conexões ativas com o banco de dados em vez de abrir e fechar
// uma nova conexão para cada requisição HTTP, garantindo alta performance e menor latência.
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'zookids_db',
  max: 20, // Máximo de conexões simultâneas no pool
  idleTimeoutMillis: 30000, // Fecha conexões inativas após 30 segundos
  connectionTimeoutMillis: 5000, // Tempo limite para estabelecer conexão
});

pool.on('connect', () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('🐘 Conectado ao banco de dados PostgreSQL com sucesso!');
  }
});

pool.on('error', (err) => {
  console.error('❌ Erro inesperado no pool do PostgreSQL:', err.message);
});

module.exports = {
  // Executa queries parametrizadas (ex: db.query('SELECT * FROM users WHERE id = $1', [id]))
  // O uso de placeholders ($1, $2) previne ataques de SQL Injection!
  query: (text, params) => pool.query(text, params),
  pool,
};
