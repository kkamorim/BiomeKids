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
    label: 'Estudos',
    route: 'Journey',
    icon: 'school-outline',
    activeIcon: 'school',
    aliases: ['Trilha', 'Journey', 'Estudos'],
  },
  {
    key: 'evolution',
    label: 'Teia',
    route: 'Evolution',
    icon: 'git-network-outline',
    activeIcon: 'git-network',
    aliases: ['Árvore', 'Arvore', 'Evolution', 'Teia'],
  },
  {
    key: 'expedition',
    label: 'Expedição',
    route: 'Expedition',
    icon: 'compass-outline',
    activeIcon: 'compass',
    aliases: ['Expedição', 'Expedicao', 'Expedition', 'Mapa'],
    featured: true,
  },
  {
    key: 'missions',
    label: 'Missões',
    route: 'Missoes',
    icon: 'flag-outline',
    activeIcon: 'flag',
    aliases: ['Missões', 'Missoes'],
  },
  {
    key: 'collection',
    label: 'Caderno',
    route: 'Colecao',
    icon: 'library-outline',
    activeIcon: 'library',
    aliases: ['Coleção', 'Colecao', 'Caderno'],
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
                item.featured && styles.navItemFeatured,
                active && styles.navItemActive,
                pressed && styles.navItemPressed,
              ]}
            >
              <View
                style={[
                  styles.iconFrame,
                  item.featured && styles.iconFrameFeatured,
                  active && !item.featured && styles.iconFrameActive,
                  active && item.featured && styles.iconFrameFeaturedActive,
                ]}
              >
                <Ionicons
                  name={active ? item.activeIcon : item.icon}
                  size={item.featured ? 26 : 21}
                  color={
                    item.featured
                      ? palette.inverseText
                      : active
                        ? palette.primaryDeep
                        : palette.textMuted
                  }
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
                style={[
                  styles.navText,
                  item.featured && styles.navTextFeatured,
                  active && styles.navTextActive,
                ]}
                numberOfLines={1}
              >
                {item.label}
              </Text>
              <View
                style={[
                  styles.activeMark,
                  active && styles.activeMarkVisible,
                  active && item.featured && styles.activeMarkFeatured,
                ]}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
