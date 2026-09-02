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
      nome: 'Jacutinga', 
      imagem: require('../../../assets/aveJacutinga.png'), 
      descricao: '🌳 Vive em florestas densas da Mata Atlântica. \n 🍎 Alimenta-se de frutos sementes e brotos. \n 🕊️ Vive em grupos pequenos e é muito importante para a dispersão de sementes.',
    },

    { 
      id: '2', 
      nome: 'Tuiuiú', 
      imagem: require('../../../assets/aveTuiuiú.png'),
      descricao: '🏞️ Habita áreas alagadas do Pantanal. \n 🐟 Alimenta-se de peixes, anfíbios e pequenos animais aquáticos. \n🏠 Faz enormes ninhos em árvores altas, reutilizando-os por vários anos.', 
    },

    { 
      id: '3', 
      nome: 'Arara Juba', 
      imagem: require('../../../assets/araraJuba.jpg'), 
      descricao: '🌴 Vive nas florestas úmidas da Amazônia. \n 🌿 Se alimenta de frutas, sementes e flores. \n 🦜 É extremamente sociável, vivendo em bandos barulhentos.'
    },
    
    { 
      id: '4', 
      nome: 'Asa-Branca', 
      imagem: require('../../../assets/asaBranca.jpg'),
      descricao: '🌾 Habita campos, cerrados e áreas abertas da Caatinga. \n 🌰 Alimenta-se de sementes, grãos e pequenos frutos. \n🕊️ Faz ninhos simples em arbustos ou árvores baixas.'  
    },

    { 
      id: '5', 
      nome: 'Jibóia', 
      imagem: require('../../../assets/jiboia.jpeg'), 
      descricao: '🌳 Vive em florestas, savanas e até áreas semiáridas. \n🐭 Alimenta-se de pequenos mamíferos, aves e répteis. \n🐍 Não é venenosa — mata suas presas por constrição (apertando até sufocar).'
    },

    {
      id: '6', 
      nome: 'Mico-Leão-Dourado', 
      imagem: require('../../../assets/micoLeao.jpeg'), 
      descricao: '🌿 Habita florestas de baixa altitude da Mata Atlântica.\n 🍉 Alimenta-se de frutas, pequenos insetos, lagartos e néctar.\n 🐒 Vive em grupos familiares e é super territorial.' 
    },
   
    { 
      id: '7', 
      nome: 'Perereca-de-Folhagem', 
      imagem: require('../../../assets/pererecaFolhagem.jpg'), 
      descricao: '🍃 Vive em florestas tropicais úmidas.\n🦗 Alimenta-se principalmente de insetos.\n🧬 Conhecida por seu jeito "grudento" nas folhas, graças às ventosas nas patas.' 
    },

    { 
      id: '8', 
      nome: 'Formigueiro-do-Litoral', 
      imagem: require('../../../assets/formigueiroLitoral.jpg'), 
      descricao: '🏝️ Vive em restingas (vegetação litorânea) da Mata Atlântica.\n🕊️ Costuma ser territorial e vive em pares.\n🐜 Se alimenta de insetos, larvas e aranhas.'
    },

    { 
      id: '9', 
      nome: 'Borboleta-Coruja', 
      imagem: require('../../../assets/borboletaCoruja.jpg'), 
      descricao: '🌴 Habita florestas tropicais e subtropicais.\n🍌 Os adultos se alimentam de frutas fermentadas e seiva; lagartas comem folhas.\n🦋 Voa principalmente no crepúsculo e tem asas com "olhos" que assustam predadores.' 
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
