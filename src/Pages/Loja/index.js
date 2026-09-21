import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ImageBackground,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CurrencyHeader from '../../components/CurrencyHeader';
import BottomNavBar from '../../components/BottomNavBar';
import { useGame } from '../../contexts/GameContext';
import styles from './styles';

export default function Loja() {
  const { coins = 10, purchaseItem } = useGame();
  const [selectedCategory, setSelectedCategory] = useState('mudas');

  const shopItems = [
    {
      id: 'item_tree_seringueira',
      category: 'mudas',
      name: 'Muda de Seringueira',
      description: 'Plante no mapa para atrair aves e enriquecer o bioma.',
      icon: '🌳',
      price: 15,
      type: 'tree',
    },
    {
      id: 'item_tree_ipe',
      category: 'mudas',
      name: 'Muda de Ipê-Amarelo',
      description: 'Árvore símbolo do Cerrado, produz flores douradas vibrantes.',
      icon: '🌲',
      price: 20,
      type: 'tree',
    },
    {
      id: 'item_flower_vitoria_regia',
      category: 'mudas',
      name: 'Vitória-Régia Aquática',
      description: 'Planta gigante que flutua nas águas do Pantanal e Amazônia.',
      icon: '🪷',
      price: 15,
      type: 'plant',
    },
    {
      id: 'item_cacto_mandacaru',
      category: 'mudas',
      name: 'Mandacaru Sertanejo',
      description: 'Cacto resistente da Caatinga que floresce ao luar.',
      icon: '🌵',
      price: 15,
      type: 'plant',
    },
    {
      id: 'item_food_apple',
      category: 'alimentos',
      name: 'Fruta Silvestre Dourada',
      description: 'Restaura 100% da fome e dá felicidade imediata ao animal.',
      icon: '🍎',
      price: 10,
      type: 'food',
    },
    {
      id: 'item_food_seeds',
      category: 'alimentos',
      name: 'Mix de Sementes da Mata',
      description: 'Alimento nutritivo adorado por tucanos e araras.',
      icon: '🌾',
      price: 8,
      type: 'food',
    },
    {
      id: 'item_structure_water',
      category: 'estruturas',
      name: 'Bebedouro Ecológico',
      description: 'Fornece água fresca e limpa para todos os animais próximos.',
      icon: '💧',
      price: 30,
      type: 'structure',
    },
    {
      id: 'item_structure_nest',
      category: 'estruturas',
      name: 'Ninho de Observação de Aves',
      description: 'Abrigo alto nas copas das árvores para o Tuiuiú e Jacutinga.',
      icon: '🪺',
      price: 25,
      type: 'structure',
    },
  ];

  const handleBuy = (item) => {
    if (coins < item.price) {
      Alert.alert(
        'Moedas Insuficientes 🪙',
        `Você precisa de ${item.price} moedas para comprar este item. Cuide dos animais e complete missões para ganhar mais!`
      );
      return;
    }

    purchaseItem(item.id, item.price);
    Alert.alert(
      'Compra Realizada! 🎉',
      `Você adquiriu "${item.name}"! O item está disponível para uso no seu inventário e no Modo Edição do Bioma.`
    );
  };

  const filteredItems = shopItems.filter((i) => i.category === selectedCategory);

  return (
    <ImageBackground
      source={require('../../../assets/fundo-ceu.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Cabeçalho com Moedas e Diamantes */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>🏪 Mercado da Floresta</Text>
            <Text style={styles.headerSubtitle}>Mudas nativas, alimentos e melhorias ecológicas</Text>
          </View>
          <CurrencyHeader />
        </View>

        {/* Categorias da Loja */}
        <View style={styles.categoryRow}>
          <Pressable
            style={[styles.categoryBtn, selectedCategory === 'mudas' && styles.categoryBtnActive]}
            onPress={() => setSelectedCategory('mudas')}
          >
            <Text
              style={[
                styles.categoryBtnText,
                selectedCategory === 'mudas' && styles.categoryBtnTextActive,
              ]}
            >
              🌱 Mudas Nativas
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.categoryBtn,
              selectedCategory === 'alimentos' && styles.categoryBtnActive,
            ]}
            onPress={() => setSelectedCategory('alimentos')}
          >
            <Text
              style={[
                styles.categoryBtnText,
                selectedCategory === 'alimentos' && styles.categoryBtnTextActive,
              ]}
            >
              🍎 Alimentos
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.categoryBtn,
              selectedCategory === 'estruturas' && styles.categoryBtnActive,
            ]}
            onPress={() => setSelectedCategory('estruturas')}
          >
            <Text
              style={[
                styles.categoryBtnText,
                selectedCategory === 'estruturas' && styles.categoryBtnTextActive,
              ]}
            >
              🏕️ Estruturas
            </Text>
          </Pressable>
        </View>

        {/* Lista de Itens */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.itemsScroll}
        >
          {filteredItems.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemIconBox}>
                <Text style={styles.itemIconEmoji}>{item.icon}</Text>
              </View>

              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDesc}>{item.description}</Text>
              </View>

              <Pressable
                style={[styles.buyBtn, coins < item.price && styles.buyBtnDisabled]}
                onPress={() => handleBuy(item)}
              >
                <Text style={styles.buyBtnPrice}>🪙 {item.price}</Text>
                <Text style={styles.buyBtnLabel}>Comprar</Text>
              </Pressable>
            </View>
          ))}
          <View style={{ height: 90 }} />
        </ScrollView>
      </SafeAreaView>

      {/* Barra de Navegação Inferior de Madeira */}
      <BottomNavBar activeTab="Loja" />
    </ImageBackground>
  );
}
