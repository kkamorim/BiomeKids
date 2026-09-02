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
      nome: 'Águia-Careca', 
  imagem: require('../../../assets/aguiaCareca.jpg'), 
      descricao: '🏞️ Vive em áreas próximas a rios, lagos e costas da América do Norte.\n🐟 Alimenta-se principalmente de peixes.\n🦅 É símbolo nacional dos Estados Unidos.' 
    },

    { 
      id: '2', 
      nome: 'Coruja-Orelhuda', 
     imagem: require('../../../assets/corujaOrelhuda.jpg'), 
      descricao: '🌳 Habita florestas, cerrados e áreas abertas da América do Sul.\n🦗 Alimenta-se de roedores, insetos e pequenos pássaros.\n👂 Possui penas em forma de “orelhas” que ajudam na camuflagem.' 
    },

    { 
      id: '3', 
      nome: 'Gavião-Carijó', 
      imagem: require('../../../assets/gaviaoCarijó.jpg'), 
      descricao: '🏡 Vive em florestas, campos e até em áreas urbanas.\n🐍 Caça répteis, roedores e pequenos pássaros.\n🦅 É um dos gaviões mais comuns no Brasil.' 
    },

    { 
      id: '4', 
      nome: 'Harpia', 
      imagem: require('../../../assets/harpia.jpg'), 
      descricao: '🌴 Habita florestas tropicais da América Central e América do Sul.\n🐒 Caça macacos, bichos-preguiça e grandes aves.\n🦅 É uma das maiores e mais poderosas águias do mundo.' 
    },
    
    { 
      id: '5', 
      nome: 'Condor-Andino', 
      imagem: require('../../../assets/condorAndino.jpg'), 
      descricao: '🏔️ Vive nas montanhas e planícies da Cordilheira dos Andes.\n🦴 Alimenta-se de carcaças de grandes animais (necrófago).\n🪂 Possui uma das maiores envergaduras de asas entre as aves.' 
    },

    { 
      id: '6', 
      nome: 'Urubu-Rei', 
      imagem: require('../../../assets/urubuRei.jpg'), 
      descricao: '🌳 Habita florestas tropicais e savanas da América Latina.\n🦴 Alimenta-se de carcaças em decomposição.\n👑 Reconhecido pela coloração vibrante da cabeça.' 
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
