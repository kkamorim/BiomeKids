import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, FlatList, Pressable, StatusBar, Modal, Button, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import styles from './styles';

export default function Territorio1() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  const dados = [
    { 
      id: '1', 
      nome: 'Onça-Pintada', 
      imagem: require('../../../assets/onça_pintada.png'), 
      descricao: '🌳 Vive em florestas densas e perto de rios.\n🦌 Alimenta-se de capivaras, veados e peixes.\n🌊 É uma excelente nadadora e caçadora solitária.'
    },

    { 
      id: '2', 
      nome: 'Onça-Parda', 
     imagem: require('../../../assets/onça_parda.png'), 
     descricao: '🏔️ Habita montanhas, florestas e campos abertos.\n🦃 Alimenta-se de animais pequenos e médios.\n🌙 Caça principalmente ao entardecer e à noite.' 
    },

    { 
      id: '3', 
      nome: 'Jacaré', 
      imagem: require('../../../assets/jacare.png'), 
      descricao: '🌿 Vive em rios, lagos e pântanos.\n🐟 Alimenta-se de peixes, aves e pequenos mamíferos.\n☀️ Passa horas tomando sol nas margens.' 
    },

    { 
      id: '4', 
      nome: 'Cágado', 
      imagem: require('../../../assets/cágado.png'), 
      descricao: '🏞️ Mora em rios, lagoas e brejos de água doce.\n🍃 Come frutas, folhas e pequenos insetos.\n🐢 Tem casco leve e gosta de nadar devagar.' 
    },

    { 
      id: '5', 
      nome: 'Elefante', 
      imagem: require('../../../assets/elefante.png'), 
      descricao: '🌾 Vive em savanas, florestas e áreas abertas.\n🍃 Alimenta-se de folhas, frutos e cascas de árvores.\n👨‍👩‍👧‍👦 Vive em grupos familiares liderados por uma fêmea.' 
    },

    { 
      id: '6', 
      nome: 'Flamingo', 
      imagem: require('../../../assets/flamingo.png'), 
      descricao: '🏖️ Habita lagos rasos e águas salgadas.\n🦐 Come pequenos camarões e algas.\n💃 Vive em grandes grupos e realiza "danças" coletivas.'
    },
  ];

  const openModal = (animal) => {
    setSelectedAnimal(animal);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedAnimal(null);
  };

  return (
    <ImageBackground
      style={styles.container}
      source={require('../../../assets/fundo3.png')}
      resizeMode="cover"
    >
      <FlatList
        data={dados}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item, index }) => (
          <Pressable
            style={[styles.itemBase]}
            onPress={() => openModal(item)}
          >
            {item.imagem && (
              <Image source={item.imagem} style={styles.animalImage} />
            )}
            <Text style={styles.text}>{item.nome}</Text>
          </Pressable>
        )}
        keyExtractor={(item) => item.id}
      />
      
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedAnimal && (
              <>
                {selectedAnimal.imagem && (
                  <Image source={selectedAnimal.imagem} style={styles.modalImage} />
                )}
                <Text style={styles.modalTitle}>{selectedAnimal.nome}</Text>
                <Text style={styles.modalDescription}>{selectedAnimal.descricao}</Text>
                <Button title="Fechar" onPress={closeModal} />
              </>
            )}
          </View>
        </View>
      </Modal>
      
      <StatusBar style="auto" />
    </ImageBackground>
  );
}
