-- ==============================================================================
-- 🦁 ZOOKIDS — SCHEMA COMPLETO DO BANCO DE DADOS POSTGRESQL
-- Arquitetura Relacional + JSONB + Auditoria LGPD + Segurança Criptográfica
-- ==============================================================================

-- 1. Habilitar a extensão pgcrypto para geração de UUIDv4 segura
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- TABELA: users (Dados dos Usuários com Proteção LGPD)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    birth_date DATE,
    cep VARCHAR(9),
    avatar_url TEXT,
    
    -- Metadados de Consentimento LGPD (Lei 13.709/2018 - Art. 7 e 8)
    lgpd_consent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    lgpd_consent_version VARCHAR(20) NOT NULL DEFAULT '1.0',
    
    -- Auditoria e Ciclo de Vida
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Soft Delete: O registro nunca é apagado fisicamente de imediato
    -- para preservar histórico e permitir anonimização controlada (LGPD Art. 16)
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

-- Índices para buscas ultrarrápidas
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users(deleted_at);

-- ==============================================================================
-- TABELA: refresh_tokens (Gerenciamento de Sessões e Rotação de Tokens)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    device_info VARCHAR(255),
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_hash ON refresh_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);

-- ==============================================================================
-- TABELA: lgpd_consent_log (Trilha Imutável de Auditoria de Privacidade)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS lgpd_consent_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL, -- 'CONSENT_GIVEN', 'CONSENT_REVOKED', 'DATA_EXPORTED', 'ACCOUNT_DELETED'
    terms_version VARCHAR(20) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lgpd_log_user_id ON lgpd_consent_log(user_id);

-- ==============================================================================
-- TABELA: species (Catálogo de Espécies e Fauna/Flora do ZooKids)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS species (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    scientific_name VARCHAR(150),
    biome VARCHAR(50) NOT NULL, -- Ex: 'Mata Atlantica', 'Cerrado', 'Pantanal', 'Amazonia'
    territorio_id INT NOT NULL, -- 1 a 6
    image_url TEXT,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- TABELA: quizzes (Motor de Estudos e Desbloqueio por Território)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    territorio_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    questions JSONB NOT NULL DEFAULT '[]',
    reward_species_id UUID REFERENCES species(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- TABELA: user_quiz_progress (Integridade Relacional de Aprendizado)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS user_quiz_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    score INT NOT NULL DEFAULT 0,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, quiz_id)
);

-- ==============================================================================
-- TABELA: habitats (Estado Gamificado com JSONB e Cuidados Temporais)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS habitats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    grid_data JSONB NOT NULL DEFAULT '{"tiles": [], "decorations": []}',
    last_watered_at TIMESTAMPTZ DEFAULT NOW(),
    last_fed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice GIN no JSONB para consultas ultrarrápidas de elementos da grade
CREATE INDEX IF NOT EXISTS idx_habitats_grid_data ON habitats USING GIN (grid_data);

-- ==============================================================================
-- TABELA: scout_photos (Câmera do Escoteiro - Phygital)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS scout_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    ai_classification JSONB,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- TABELAS: badges e user_badges (Sistema de Conquistas e Selos)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);
