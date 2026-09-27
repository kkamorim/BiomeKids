import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGame } from '../../contexts/GameContext';
import { palette, spacing } from '../../theme/designSystem';
import styles from './styles';

const NAV_ITEMS = [
  {
    key: 'journey',
    label: 'Trilha',
    route: 'Journey',
    icon: 'map-outline',
    activeIcon: 'map',
    aliases: ['Trilha', 'Journey', 'Estudos'],
  },
  {
    key: 'evolution',
    label: 'Árvore',
    route: 'Evolution',
    icon: 'git-network-outline',
    activeIcon: 'git-network',
    aliases: ['Árvore', 'Arvore', 'Evolution'],
  },
  {
    key: 'missions',
    label: 'Missões',
    route: 'Missoes',
    icon: 'ribbon-outline',
    activeIcon: 'ribbon',
    aliases: ['Missões', 'Missoes'],
  },
  {
    key: 'collection',
    label: 'Coleção',
    route: 'Colecao',
    icon: 'paw-outline',
    activeIcon: 'paw',
    aliases: ['Coleção', 'Colecao'],
  },
  {
    key: 'shop',
    label: 'Loja',
    route: 'Loja',
    icon: 'storefront-outline',
    activeIcon: 'storefront',
    aliases: ['Loja'],
  },
];

function isItemActive(item, activeTab) {
  if (!activeTab) return false;
  const normalizedActiveTab = String(activeTab).toLocaleLowerCase('pt-BR');
  return [item.route, item.label, ...item.aliases].some(
    (value) => value.toLocaleLowerCase('pt-BR') === normalizedActiveTab
  );
}

export default function BottomNavBar({ activeTab = 'Journey', style }) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { unclaimedMissions = 0 } = useGame();

  const navigateTo = (item, active) => {
    if (!active) {
      navigation.navigate(item.route);
    }
  };

  return (
    <View
      pointerEvents={'box-none'}
      style={[
        styles.outerContainer,
        { paddingBottom: Math.max(insets.bottom, spacing.xs) },
        style,
      ]}
    >
      <View style={styles.navShell} accessibilityRole={'tablist'}>
        {NAV_ITEMS.map((item) => {
          const active = isItemActive(item, activeTab);
          const badgeCount = item.key === 'missions' ? unclaimedMissions : 0;

          return (
            <Pressable
              key={item.key}
              accessibilityRole={'tab'}
              accessibilityLabel={item.label + ', aba'}
              accessibilityState={{ selected: active }}
              hitSlop={4}
              onPress={() => navigateTo(item, active)}
              style={({ pressed }) => [
                styles.navItem,
                active && styles.navItemActive,
                pressed && styles.navItemPressed,
              ]}
            >
              <View style={[styles.iconCircle, active && styles.iconCircleActive]}>
                <Ionicons
                  name={active ? item.activeIcon : item.icon}
                  size={21}
                  color={active ? palette.inverseText : palette.textMuted}
                />
                {badgeCount > 0 ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText} numberOfLines={1}>
                      {badgeCount > 99 ? '99+' : badgeCount}
                    </Text>
                  </View>
                ) : null}
              </View>
              <Text
                style={[styles.navText, active && styles.navTextActive]}
                numberOfLines={1}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
