-- ==============================================================================
-- 🔄 ZOOKIDS — GAME LOOP: MIGRATION 002
-- Sistema completo de progressão, loja, missões e estudos
-- ==============================================================================

-- ==============================================================================
-- TABELA: user_game_state (Estado Central do Jogador)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS user_game_state (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    
    -- Economia
    coins INT NOT NULL DEFAULT 10,          -- Moedas iniciais de boas-vindas
    total_coins_earned INT NOT NULL DEFAULT 10,
    
    -- Progressão
    xp INT NOT NULL DEFAULT 0,
    level INT NOT NULL DEFAULT 1,
    title VARCHAR(50) NOT NULL DEFAULT 'Escoteiro Iniciante',
    
    -- Streaks
    daily_streak INT NOT NULL DEFAULT 0,
    last_daily_completed_at TIMESTAMPTZ,
    last_login_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_game_state_user ON user_game_state(user_id);

-- ==============================================================================
-- TABELA: user_animals (Animais Desbloqueados + Evolução)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS user_animals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    species_id UUID NOT NULL REFERENCES species(id) ON DELETE CASCADE,
    
    -- Evolução: 'egg' -> 'baby' -> 'juvenile' -> 'adult'
    evolution_stage VARCHAR(20) NOT NULL DEFAULT 'egg',
    research_xp INT NOT NULL DEFAULT 0,
    research_xp_threshold INT NOT NULL DEFAULT 100,
    
    -- Estado de Cuidado
    hunger INT NOT NULL DEFAULT 80,        -- 0-100 (0 = faminto)
    thirst INT NOT NULL DEFAULT 80,        -- 0-100 (0 = sedento)
    happiness INT NOT NULL DEFAULT 70,     -- 0-100 (0 = triste)
    
    -- Bônus
    has_scientist_bonus BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Timestamps
    last_fed_at TIMESTAMPTZ DEFAULT NOW(),
    last_watered_at TIMESTAMPTZ DEFAULT NOW(),
    unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(user_id, species_id)
);

CREATE INDEX IF NOT EXISTS idx_user_animals_user ON user_animals(user_id);

-- ==============================================================================
-- TABELA: shop_items (Catálogo da Loja)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS shop_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(30) NOT NULL,  -- 'food_rare', 'seed', 'accessory', 'automation', 'potion'
    icon VARCHAR(50),               -- Nome do ícone (Ionicons/FontAwesome)
    
    -- Economia
    price INT NOT NULL DEFAULT 1,
    
    -- Efeitos (JSONB flexível)
    effects JSONB NOT NULL DEFAULT '{}',
    -- Ex: {"happiness_boost": 30, "duration_hours": 24, "target": "specific_species"}
    
    -- Disponibilidade
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    min_level INT NOT NULL DEFAULT 1,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- TABELA: user_inventory (Inventário do Jogador)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS user_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES shop_items(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 1,
    purchased_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(user_id, item_id)
);

CREATE INDEX IF NOT EXISTS idx_user_inventory_user ON user_inventory(user_id);

-- ==============================================================================
-- TABELA: missions (Catálogo de Missões)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    
    -- Tipo: 'daily', 'weekly', 'biome', 'achievement'
    type VARCHAR(20) NOT NULL DEFAULT 'daily',
    
    -- Condição de conclusão (JSONB flexível)
    condition JSONB NOT NULL DEFAULT '{}',
    -- Ex: {"action": "feed_animal", "count": 2}
    -- Ex: {"action": "complete_quiz", "territorio_id": 1, "count": 3}
    
    -- Recompensas
    reward_coins INT NOT NULL DEFAULT 1,
    reward_xp INT NOT NULL DEFAULT 10,
    reward_item_id UUID REFERENCES shop_items(id) ON DELETE SET NULL,
    
    -- Metadados
    territorio_id INT,  -- NULL = missão global
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- TABELA: user_missions (Progresso de Missões do Jogador)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS user_missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
    
    progress INT NOT NULL DEFAULT 0,
    target INT NOT NULL DEFAULT 1,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    claimed BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Para missões diárias/semanais: data de atribuição
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    claimed_at TIMESTAMPTZ,
    
    UNIQUE(user_id, mission_id, assigned_at)
);

CREATE INDEX IF NOT EXISTS idx_user_missions_user ON user_missions(user_id);

-- ==============================================================================
-- TABELA: biome_events (Eventos de Crise nos Biomas)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS biome_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    territorio_id INT NOT NULL,
    
    -- Tipo: 'polluted_river', 'drought', 'invasive_species', 'deforestation'
    event_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Requisito de resolução
    resolution_quiz_topic VARCHAR(100),  -- Tópico de estudo necessário
    resolution_type VARCHAR(30) NOT NULL DEFAULT 'quiz',  -- 'quiz' ou 'minigame'
    
    -- Estado
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    resolved_at TIMESTAMPTZ,
    
    -- Recompensas por resolver
    reward_coins INT NOT NULL DEFAULT 3,
    reward_xp INT NOT NULL DEFAULT 25,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_biome_events_user ON biome_events(user_id);
CREATE INDEX IF NOT EXISTS idx_biome_events_active ON biome_events(is_active);

-- ==============================================================================
-- TABELA: user_study_progress (Progresso de Estudo por Espécie)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS user_study_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    species_id UUID NOT NULL REFERENCES species(id) ON DELETE CASCADE,
    
    -- Progresso de livros/módulos
    books_read INT NOT NULL DEFAULT 0,
    total_books INT NOT NULL DEFAULT 3,
    
    -- Quizzes
    quizzes_completed INT NOT NULL DEFAULT 0,
    total_quizzes INT NOT NULL DEFAULT 2,
    best_quiz_score INT NOT NULL DEFAULT 0,
    
    -- Status de Cientista Júnior (todos os livros + quizzes)
    is_scientist BOOLEAN NOT NULL DEFAULT FALSE,
    scientist_unlocked_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(user_id, species_id)
);

CREATE INDEX IF NOT EXISTS idx_user_study_user ON user_study_progress(user_id);

-- ==============================================================================
-- SEED: Itens iniciais da Loja
-- ==============================================================================
INSERT INTO shop_items (name, description, category, icon, price, effects) VALUES
    -- Alimentos Raros
    ('Fruta Dourada', 'Fruta rara que atrai espécies lendárias ao seu bioma', 'food_rare', 'nutrition', 5, '{"happiness_boost": 40, "attracts_legendary": true}'),
    ('Mel Silvestre', 'Mel especial que deixa qualquer animal extremamente feliz', 'food_rare', 'cafe', 3, '{"happiness_boost": 25}'),
    ('Peixe Cristalino', 'Peixe de águas profundas, raro e nutritivo', 'food_rare', 'fish', 4, '{"hunger_restore": 50, "happiness_boost": 15}'),
    
    -- Sementes Exóticas
    ('Semente de Ipê Rosa', 'Planta um ipê rosa que embeleza o bioma', 'seed', 'leaf', 5, '{"decoration": "ipe_rosa", "biome_beauty": 20}'),
    ('Semente de Vitória-Régia', 'A maior planta aquática do mundo para seu lago', 'seed', 'flower', 7, '{"decoration": "vitoria_regia", "biome_beauty": 30}'),
    ('Semente de Bromélia', 'Planta colorida que atrai beija-flores', 'seed', 'color-palette', 6, '{"decoration": "bromelia", "attracts_species": "beija_flor"}'),
    
    -- Acessórios
    ('Chapéu de Explorador', 'Um chapéu estiloso para seu avatar', 'accessory', 'hat', 3, '{"avatar_cosmetic": "explorer_hat"}'),
    ('Óculos de Cientista', 'Óculos que dão +10% XP de pesquisa', 'accessory', 'glasses', 8, '{"research_xp_bonus": 0.1}'),
    ('Bandana do Escoteiro', 'Bandana oficial que mostra seu ranking', 'accessory', 'ribbon', 2, '{"avatar_cosmetic": "scout_bandana"}'),
    
    -- Automação
    ('Coletor de Chuva', 'Coleta água automaticamente quando o app está fechado', 'automation', 'water', 15, '{"auto_water_hours": 8}'),
    ('Comedouro Automático', 'Alimenta seus animais automaticamente por 12 horas', 'automation', 'restaurant', 18, '{"auto_feed_hours": 12}'),
    
    -- Poções de Pesquisa
    ('Poção de Sabedoria', 'XP de pesquisa dobrado por 1 hora', 'potion', 'flask', 4, '{"research_xp_multiplier": 2, "duration_minutes": 60}'),
    ('Lente de Aumento', 'Revela dicas extras nos quizzes por 30 minutos', 'potion', 'search', 3, '{"quiz_hints": true, "duration_minutes": 30}')
ON CONFLICT DO NOTHING;

-- ==============================================================================
-- SEED: Missões Iniciais
-- ==============================================================================
INSERT INTO missions (title, description, icon, type, condition, reward_coins, reward_xp) VALUES
    -- Diárias
    ('Alimentar 2 Animais', 'Dê comida para pelo menos 2 animais no seu bioma', 'restaurant', 'daily', '{"action": "feed_animal", "count": 2}', 1, 10),
    ('Completar 1 Quiz', 'Estude e complete um quiz sobre qualquer espécie', 'school', 'daily', '{"action": "complete_quiz", "count": 1}', 1, 15),
    ('Visitar seu Bioma', 'Entre no seu bioma e verifique seus animais', 'earth', 'daily', '{"action": "visit_biome", "count": 1}', 1, 5),
    
    -- Semanais
    ('Evoluir 1 Animal', 'Faça um animal evoluir de estágio (ex: filhote → juvenil)', 'trending-up', 'weekly', '{"action": "evolve_animal", "count": 1}', 5, 50),
    ('Resolver 1 Crise', 'Resolva um evento de crise em qualquer bioma', 'shield-checkmark', 'weekly', '{"action": "resolve_crisis", "count": 1}', 5, 40),
    ('Desbloquear 2 Espécies', 'Descubra 2 novas espécies na sua coleção', 'paw', 'weekly', '{"action": "unlock_species", "count": 2}', 3, 30),
    
    -- Bioma (permanentes)
    ('Mestre do Pantanal', 'Complete todos os quizzes do Pantanal', 'trophy', 'biome', '{"action": "complete_all_quizzes", "territorio_id": 1}', 10, 100),
    ('Mestre da Amazônia', 'Complete todos os quizzes da Amazônia', 'trophy', 'biome', '{"action": "complete_all_quizzes", "territorio_id": 2}', 10, 100),
    ('Mestre do Cerrado', 'Complete todos os quizzes do Cerrado', 'trophy', 'biome', '{"action": "complete_all_quizzes", "territorio_id": 3}', 10, 100),
    ('Mestre da Caatinga', 'Complete todos os quizzes da Caatinga', 'trophy', 'biome', '{"action": "complete_all_quizzes", "territorio_id": 4}', 10, 100),
    ('Mestre da Mata Atlântica', 'Complete todos os quizzes da Mata Atlântica', 'trophy', 'biome', '{"action": "complete_all_quizzes", "territorio_id": 5}', 10, 100),
    ('Mestre do Pampa', 'Complete todos os quizzes do Pampa', 'trophy', 'biome', '{"action": "complete_all_quizzes", "territorio_id": 6}', 10, 100)
ON CONFLICT DO NOTHING;
