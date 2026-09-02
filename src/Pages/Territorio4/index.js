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
      nome: 'Rinoceronte', 
      imagem: require('../../../assets/rinoceronte.jpg'), 
      descricao: '🌾 Habita savanas, florestas e regiões secas da África e Ásia.\n🌿 Alimenta-se de gramíneas, folhas e galhos.\n🦏 Possui pele espessa e um ou dois chifres característicos.'
 
    },


    { 
      id: '2', 
      nome: 'Zebra', 
      imagem: require('../../../assets/zebra.jpg'), 
      descricao: '🏜️ Vive em savanas e planícies da África.\n🌱 Alimenta-se principalmente de capim e outras plantas rasteiras.\n⚪⚫ Suas listras únicas ajudam a confundir predadores.' 
    },

    { 
      id: '3', 
      nome: 'Girafa', 
      imagem: require('../../../assets/girafa.jpg'), 
      descricao: '🌳 Habita savanas e regiões semiáridas da África.\n🍃 Se alimenta de folhas de acácias e outras árvores altas.\n🦒 É o animal terrestre mais alto do mundo.' 
    },


    { 
      id: '4', 
      nome: 'Suricata', 
      imagem: require('../../../assets/suricata.jpg'), 
      descricao: '🏜️ Vive em áreas áridas e savanas do sul da África.\n🦗 Alimenta-se de insetos, pequenos vertebrados e frutas.\n👀 Conhecida por ficar em pé como sentinela do grupo.'
    },
 

    { 
      id: '5', 
      nome: 'Dromedário', 
      imagem: require('../../../assets/dromedario.jpg'), 
      descricao: '🏜️ Habita desertos e regiões secas da África e Oriente Médio.\n🌵 Alimenta-se de vegetação resistente e espinhosa.\n🐪 Possui uma única corcova para armazenar gordura.' 
    },


    { 
      id: '6', 
      nome: 'Leão', 
      imagem: require('../../../assets/leao.jpg'), 
      descricao: '🏞️ Vive em savanas e campos abertos da África.\n🍖 Alimenta-se de grandes herbívoros, como zebras e gnus.\n🦁 Vive em grupos chamados alcateias, liderados por fêmeas.' 
    },

    { 
      id: '7', 
      nome: 'Tigre', 
      imagem: require('../../../assets/tigre.jpg'), 
      descricao: '🌳 Habita florestas tropicais, manguezais e áreas abertas da Ásia.\n🍖 Caça cervos, javalis e outros grandes herbívoros.\n🐅 É o maior dos felinos e geralmente vive solitário.' 
    },

    { 
      id: '8', 
      nome: 'Hipopótamo', 
      imagem: require('../../../assets/hipopotamo.jpg'), 
      descricao: '🌊 Vive em rios, lagos e áreas alagadas da África.\n🌾 Alimenta-se de capim nas margens durante a noite.\n🦛 Passa grande parte do dia submerso para se refrescar.' 
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
