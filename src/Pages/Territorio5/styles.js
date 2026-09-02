import { StyleSheet, Dimensions, Button } from 'react-native';

const { width } = Dimensions.get('window');
const itemSize = (width - 50) / 2; // ajustado para melhor espaçamento

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cde4c5',
    padding: 16,
  },
  itemBase: {
    width: itemSize,
    height: itemSize,
    borderRadius: itemSize / 2, 
    alignItems: 'center',
    margin: 4,
    backgroundColor: '#ffffff90',
    marginTop:50,
  },
  text: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  animalImage: {
    width: itemSize, // Usando o mesmo tamanho que o item para manter o formato circular
    height: itemSize,
    borderRadius: itemSize / 2, // Garantir que a imagem seja circular
    resizeMode: 'cover', // Usando 'cover' para cobrir o container de forma apropriada
    marginBottom: 10,
  },
  
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(39, 30, 19, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#cde1c9',
    borderWidth:3,
    borderColor:'#7ca47b',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  modalImage: {
    width: itemSize,
    height: itemSize,
    borderRadius:itemSize/2,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#395039',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 16,
  },

  Button:{
    backgroundColor: '#7ca47b',
    borderWidth:1,
    borderColor:"#2f422f", 
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    width: 200,
    shadowColor: '#000',
    color:"#ffffff",
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    marginTop:20,
  },

});