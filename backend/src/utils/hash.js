const bcrypt = require('bcryptjs');

// Número de "salt rounds" para o bcrypt.
// 12 rounds garante alta resistência contra ataques de dicionário e Rainbow Tables,
// demorando cerca de ~250ms por hash, ideal para proteger senhas infantis/familiares.
const SALT_ROUNDS = 12;

/**
 * Gera um hash irreversível da senha em texto puro
 * @param {string} password - Senha enviada pelo usuário
 * @returns {Promise<string>} Hash bcrypt seguro
 */
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
}

/**
 * Compara uma senha em texto puro com o hash salvo no banco
 * @param {string} password - Senha enviada no login
 * @param {string} hashedPassword - Hash recuperado do banco de dados
 * @returns {Promise<boolean>} Verdadeiro se a senha estiver correta
 */
async function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

module.exports = {
  hashPassword,
  comparePassword,
};
