import { StatusBar } from 'expo-status-bar';
import { Pressable, Text, View, FlatList, ImageBackground} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';

export default function Territorio() {
  const navigation = useNavigation();

  const dados = [
    { id: '1', nome: '' },
    { id: '2', nome: '' },
    { id: '3', nome: '' },
    { id: '4', nome: '' },
    { id: '5', nome: '' },
    { id: '6', nome: '' },
  ];
  

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
            style={[styles.itemBase, styles[`btn${item.id}`]]}
            onPress={() => navigation.navigate(`Territorio${item.id}`)}
          >
            <Text style={styles.text}>
              {index + 1} {item.nome}
            </Text>
          </Pressable>
        )}
        keyExtractor={(item) => item.id}
      />

      <StatusBar style="auto" />
   
    </ImageBackground>
  );
}
