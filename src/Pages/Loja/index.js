import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppBackground from '../../components/AppBackground';
import BottomNavBar from '../../components/BottomNavBar';
import StatusHeader from '../../components/StatusHeader';
import { useGame } from '../../contexts/GameContext';
import { SHOP_ITEMS } from '../../data/biomeJourney';
import { alpha, palette } from '../../theme/designSystem';
import styles from './styles';

const CATEGORIES = [
  { id: 'energy', label: 'Energia', icon: 'flash' },
  { id: 'boost', label: 'Boosts', icon: 'rocket' },
  { id: 'cosmetic', label: 'Cosméticos', icon: 'color-palette' },
];

function normalized(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function categoryFor(item) {
  const category = normalized(item?.category);
  const type = normalized(item?.type);

  if (
    type === 'fuel'
    || type === 'hearts'
    || category.includes('energy')
    || category.includes('energia')
    || category.includes('consum')
  ) {
    return 'energy';
  }

  if (
    type.includes('boost')
    || category.includes('boost')
    || category.includes('impulso')
    || category.includes('multiplicador')
  ) {
    return 'boost';
  }

  return 'cosmetic';
}

function walletFor(item, game) {
  return item.currency === 'diamonds'
    ? Number(game.diamonds || 0)
    : Number(game.coins || 0);
}

function currencyDetails(item) {
  return item.currency === 'diamonds'
    ? { icon: 'diamond', label: 'diamantes', color: palette.diamond }
    : { icon: 'cash', label: 'moedas', color: palette.coin };
}

function effectText(item) {
  if (typeof item.effect === 'string') return item.effect;
  if (item.type === 'fuel') return 'Recupera ' + (item.value || 1) + ' de combustível';
  if (item.type === 'hearts') return 'Recupera ' + (item.value || 1) + ' corações';
  if (item.type === 'coinBoost') {
    return '2× moedas por ' + (item.durationMinutes || 30) + ' min';
  }
  if (item.type === 'xpBoost') {
    return '2× XP por ' + (item.durationMinutes || 30) + ' min';
  }
  if (item.type === 'allBoost') {
    return '2× moedas e XP por ' + (item.durationMinutes || 60) + ' min';
  }
  return 'Fica disponível no seu inventário';
}

function timestamp(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function remainingTime(until, now) {
  const minutes = Math.ceil(Math.max(0, timestamp(until) - now) / 60000);
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    return rest ? hours + 'h ' + rest + 'min' : hours + 'h';
  }
  return minutes + ' min';
}

function WalletCard({ icon, label, value, color }) {
  return (
    <View style={styles.walletCard}>
      <View style={[styles.walletIcon, { backgroundColor: alpha(color, 0.12) }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View>
        <Text style={styles.walletLabel}>{label}</Text>
        <Text style={styles.walletValue}>{Math.floor(Number(value) || 0)}</Text>
      </View>
    </View>
  );
}

function ShopItemCard({ item, quantity, game, onBuy }) {
  const currency = currencyDetails(item);
  const canAfford = walletFor(item, game) >= Number(item.price || 0);
  const isCapped = (item.type === 'fuel' && game.fuel >= game.maxFuel)
    || (item.type === 'hearts' && game.hearts >= game.maxHearts)
    || (item.type === 'cosmetic' && quantity > 0);

  return (
    <View style={styles.itemCard}>
      <View style={styles.itemTopRow}>
        <View style={styles.itemIconBox}>
          <Text style={styles.itemIcon}>{item.icon || '🎁'}</Text>
          {quantity > 0 ? (
            <View style={styles.quantityBadge}>
              <Text style={styles.quantityText}>{quantity}</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.itemCopy}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDescription}>{item.description}</Text>
        </View>
      </View>

      <View style={styles.effectRow}>
        <Ionicons name={'sparkles'} size={15} color={palette.primaryDark} />
        <Text style={styles.effectText}>{effectText(item)}</Text>
      </View>

      <View style={styles.itemFooter}>
        <View style={styles.pricePill}>
          <Ionicons name={currency.icon} size={17} color={currency.color} />
          <Text style={styles.priceText}>{item.price}</Text>
        </View>
        <Pressable
          accessibilityRole={'button'}
          accessibilityLabel={
            'Comprar ' + item.name + ' por ' + item.price + ' ' + currency.label
          }
          onPress={() => onBuy(item, isCapped)}
          style={({ pressed }) => [
            styles.buyButton,
            (!canAfford || isCapped) && styles.buyButtonUnavailable,
            pressed && styles.buyButtonPressed,
          ]}
        >
          <Text style={styles.buyButtonText}>
            {item.type === 'cosmetic' && quantity > 0 ? 'Adquirido' : isCapped ? 'Completo' : 'Comprar'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function Loja() {
  const game = useGame();
  const [selectedCategory, setSelectedCategory] = useState('energy');
  const [feedback, setFeedback] = useState(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!feedback) return undefined;
    const timeout = setTimeout(() => setFeedback(null), 4200);
    return () => clearTimeout(timeout);
  }, [feedback]);

  const categorizedItems = useMemo(
    () => (Array.isArray(SHOP_ITEMS) ? SHOP_ITEMS : [])
      .map((item) => ({ ...item, resolvedCategory: categoryFor(item) })),
    []
  );
  const visibleItems = categorizedItems.filter(
    (item) => item.resolvedCategory === selectedCategory
  );
  const inventory = game.inventory || {};
  const inventoryKinds = Object.values(inventory)
    .filter((amount) => Number(amount) > 0).length;
  const inventoryTotal = Object.values(inventory)
    .reduce((sum, amount) => sum + Math.max(0, Number(amount) || 0), 0);
  const boosts = [
    {
      id: 'coins',
      title: 'moedas em dobro',
      icon: 'cash',
      color: palette.coin,
      multiplier: game.activeMultipliers?.coins || game.coinMultiplier || 1,
      until: game.activeBoosts?.coinsUntil,
    },
    {
      id: 'xp',
      title: 'XP em dobro',
      icon: 'star',
      color: palette.secondary,
      multiplier: game.activeMultipliers?.xp || game.xpMultiplier || 1,
      until: game.activeBoosts?.xpUntil,
    },
  ].filter((boost) => timestamp(boost.until) > now);

  const handleBuy = (item, isCapped) => {
    const currency = currencyDetails(item);

    if (isCapped) {
      const capMessage = item.type === 'cosmetic'
        ? 'Este cosmético já faz parte do seu inventário.'
        : item.type === 'fuel'
          ? 'Seu combustível já está completo.'
          : 'Seus corações já estão completos.';
      setFeedback({
        type: 'warning',
        message: capMessage,
      });
      return;
    }

    if (walletFor(item, game) < Number(item.price || 0)) {
      const missing = Math.ceil(Number(item.price || 0) - walletFor(item, game));
      setFeedback({
        type: 'warning',
        message: 'Faltam ' + missing + ' ' + currency.label + ' para esta compra.',
      });
      return;
    }

    const purchased = game.purchaseShopItem(item.id);
    setFeedback(purchased
      ? { type: 'success', message: item.name + ' foi adicionado ao seu inventário.' }
      : { type: 'warning', message: 'Não foi possível concluir a compra agora.' });
  };

  return (
    <AppBackground
      colors={['#F4FAEF', '#FFF7E3']}
      decorationColors={[palette.primary, palette.coin, palette.secondary]}
    >
      <StatusHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.headingRow}>
          <View style={styles.headingCopy}>
            <Text style={styles.eyebrow}>LOJA DA EXPEDIÇÃO</Text>
            <Text style={styles.title}>Prepare a próxima descoberta</Text>
            <Text style={styles.subtitle}>
              Troque suas recompensas por energia, multiplicadores e itens especiais.
            </Text>
          </View>
          <View style={styles.storeIcon}>
            <Ionicons name={'storefront'} size={29} color={palette.primaryDark} />
          </View>
        </View>

        <View style={styles.walletRow}>
          <WalletCard icon={'cash'} label={'Moedas'} value={game.coins} color={palette.coin} />
          <WalletCard
            icon={'diamond'}
            label={'Diamantes'}
            value={game.diamonds}
            color={palette.diamond}
          />
        </View>

        <View style={styles.inventorySummary}>
          <View style={styles.inventoryIcon}>
            <Ionicons name={'bag-handle'} size={21} color={palette.primaryDark} />
          </View>
          <View style={styles.inventoryCopy}>
            <Text style={styles.inventoryTitle}>Seu inventário</Text>
            <Text style={styles.inventorySubtitle}>
              {inventoryTotal > 0
                ? inventoryTotal
                  + (inventoryTotal === 1 ? ' item em ' : ' itens em ')
                  + inventoryKinds
                  + (inventoryKinds === 1 ? ' tipo' : ' tipos')
                : 'Os itens comprados aparecerão aqui'}
            </Text>
          </View>
          <Text style={styles.inventoryCount}>{inventoryTotal}</Text>
        </View>

        {boosts.length > 0 ? (
          <View style={styles.activeBoosts}>
            <View style={styles.sectionLabelRow}>
              <Ionicons name={'timer'} size={18} color={palette.secondaryDark} />
              <Text style={styles.sectionLabel}>Boosts ativos</Text>
            </View>
            <View style={styles.boostList}>
              {boosts.map((boost) => (
                <View key={boost.id} style={styles.boostChip}>
                  <Ionicons name={boost.icon} size={16} color={boost.color} />
                  <Text style={styles.boostName}>
                    {boost.multiplier + '× ' + boost.title}
                  </Text>
                  <Text style={styles.boostTime}>{remainingTime(boost.until, now)}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {feedback ? (
          <View
            accessibilityLiveRegion={'polite'}
            style={[
              styles.feedback,
              feedback.type === 'success' ? styles.feedbackSuccess : styles.feedbackWarning,
            ]}
          >
            <Ionicons
              name={feedback.type === 'success' ? 'checkmark-circle' : 'information-circle'}
              size={20}
              color={feedback.type === 'success' ? palette.success : palette.warning}
            />
            <Text style={styles.feedbackText}>{feedback.message}</Text>
          </View>
        ) : null}

        <View style={styles.tabs} accessibilityRole={'tablist'}>
          {CATEGORIES.map((category) => {
            const active = category.id === selectedCategory;
            const count = categorizedItems.filter(
              (item) => item.resolvedCategory === category.id
            ).length;
            return (
              <Pressable
                key={category.id}
                accessibilityRole={'tab'}
                accessibilityState={{ selected: active }}
                onPress={() => setSelectedCategory(category.id)}
                style={({ pressed }) => [
                  styles.tab,
                  active && styles.tabActive,
                  pressed && styles.tabPressed,
                ]}
              >
                <Ionicons
                  name={category.icon}
                  size={18}
                  color={active ? palette.inverseText : palette.textMuted}
                />
                <Text style={[styles.tabText, active && styles.tabTextActive]}>
                  {category.label}
                </Text>
                <View style={[styles.tabCount, active && styles.tabCountActive]}>
                  <Text style={[styles.tabCountText, active && styles.tabCountTextActive]}>
                    {count}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.itemsGrid}>
          {visibleItems.map((item) => (
            <ShopItemCard
              key={item.id}
              item={item}
              quantity={Number(inventory[item.id] || 0)}
              game={game}
              onBuy={handleBuy}
            />
          ))}
        </View>

        {visibleItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name={'leaf-outline'} size={34} color={palette.textSubtle} />
            <Text style={styles.emptyTitle}>Novidades a caminho</Text>
            <Text style={styles.emptyText}>Ainda não há itens nesta categoria.</Text>
          </View>
        ) : null}

        <View style={styles.shopTip}>
          <Ionicons name={'bulb'} size={20} color={palette.warning} />
          <Text style={styles.shopTipText}>
            Complete estudos e missões diárias para ganhar mais moedas e diamantes.
          </Text>
        </View>
      </ScrollView>

      <BottomNavBar activeTab={'Loja'} />
    </AppBackground>
  );
}
