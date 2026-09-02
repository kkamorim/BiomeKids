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
      nome: 'Axalote', 
      imagem: require('../../../assets/axalote.jpg'),
      descricao: '🌊 Vive em lagos e canais de água doce no México.\n🐟 Alimenta-se de pequenos peixes, vermes e larvas.\n✨ É famoso por manter características de larva mesmo na fase adulta (neotenia).'  
    },

    {       
      id: '2', 
      nome: 'Raposinha-do-Campo', 
      imagem: require('../../../assets/raposa.jpg'), 
      descricao: '🌾 Habita campos e cerrados do Brasil central.\n🦗 Alimenta-se principalmente de insetos, frutas e pequenos vertebrados.\n🦊 É solitária e ativa principalmente ao entardecer e à noite.' 
    },

    { 
      id: '3', 
      nome: 'Cachorro-do-Mato', 
      imagem: require('../../../assets/cachorro.jpg'), 
      descricao: '🌿 Vive em florestas, cerrados e áreas abertas da América do Sul.\n🍗 Tem dieta variada: pequenos animais, frutas e carniça.\n🐕 Costuma viver em pares ou pequenos grupos familiares.' 
    },

    { 
      id: '4', 
      nome: 'Tamanduá-Bandeira', 
      imagem: require('../../../assets/tamandua.jpg'), 
      descricao: '🌎 Habita cerrados, campos e florestas abertas das Américas.\n🐜 Alimenta-se quase exclusivamente de formigas e cupins.\n👅 Usa a língua longa e pegajosa para capturar suas presas.' 
    },

    { 
      id: '5', 
      nome: 'Urso-de-Óculos', 
      imagem: require('../../../assets/urso.jpg'), 
      descricao: '🏔️ Vive em florestas e áreas montanhosas da América do Sul (Andes).\n🍃 É onívoro: come frutas, folhas, pequenos animais e insetos.\n🕶️ Tem manchas claras no rosto que lembram óculos.' 
    },

    { 
      id: '6', 
      nome: 'Dinossauro', 
      imagem: require('../../../assets/dino.jpg'), 
      descricao: '🌋 Viveu em florestas e planícies do Cretáceo tardio (há 68 milhões de anos).\n🍖 Era carnívoro, caçando grandes presas e se alimentando também de carniça.\n🦖 Famoso por seus braços minúsculos e mordida superpoderosa.' 
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
