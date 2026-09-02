const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev_access_secret_zookids_2026';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_zookids_2026';
const ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

/**
 * Gera um Access Token (JWT de curta duração, 15 minutos)
 * Contém dados essenciais do usuário (id, email)
 */
function generateAccessToken(payload) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES_IN });
}

/**
 * Gera um Refresh Token (JWT de longa duração, 30 dias)
 * Usado para emitir novos Access Tokens sem exigir novo login
 */
function generateRefreshToken(payload) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });
}

/**
 * Valida o Access Token e retorna o payload decodificado
 */
function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_SECRET);
}

/**
 * Valida o Refresh Token e retorna o payload decodificado
 */
function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_SECRET);
}

/**
 * Gera um hash criptográfico SHA-256 do token
 * O Refresh Token nunca deve ser salvo em texto puro no banco de dados.
 * Se o banco vazar, os atacantes não conseguem usar os tokens de sessão!
 */
function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  hashToken,
};
