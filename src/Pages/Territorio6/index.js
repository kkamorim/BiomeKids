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
      nome: 'Lontra', 
      imagem: require('../../../assets/lontra.jpg'), 
      descricao: '🏞️ Vive em rios, lagos e áreas alagadas das Américas.\n🐟 Alimenta-se de peixes, crustáceos e pequenos vertebrados aquáticos.\n🦦 É excelente nadadora e muito brincalhona.' 
    },

    { 
      id: '2', 
      nome: 'Chimpanzé', 
      imagem: require('../../../assets/chimpanze.jpg'), 
      descricao: '🌿 Vive em florestas e savanas da África Central.\n🍎 Alimenta-se de frutas, sementes, insetos e ocasionalmente caça pequenos animais.\n🧠 É altamente inteligente e utiliza ferramentas no dia a dia.' 
    },

    { 
      id: '3', 
      nome: 'Orangotango', 
      imagem: require('../../../assets/orangotango.jpg'), 
      descricao: '🌴 Habita florestas tropicais da Indonésia e Malásia.\n🍃 Alimenta-se de frutas, folhas e insetos.\n🦧 Passa a maior parte do tempo nas árvores, sendo um dos primatas mais solitários.' 
    },

    { 
      id: '4', 
      nome: 'Mico-Leão-Preto', 
      imagem: require('../../../assets/micoleaoPreto.jpg'), 
      descricao: '🌳 Habita fragmentos de Mata Atlântica no interior de São Paulo.\n🍉 Alimenta-se de frutas, insetos e pequenos vertebrados.\n🐒 Está em perigo crítico de extinção e vive em pequenos grupos familiares.' 
    },

    { 
      id: '5', 
      nome: 'Muriqui-do-Sul', 
      imagem: require('../../../assets/muriqui.jpg'), 
      descricao: '🌳 Vive nas florestas da Mata Atlântica no sudeste do Brasil.\n🍃 Alimenta-se de folhas, frutos e flores.\n🐒 É o maior primata das Américas e vive em grupos pacíficos.' 
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
