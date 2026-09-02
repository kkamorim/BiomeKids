import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  TextInput,
  View,
  Pressable,
  Text,
  ImageBackground,
  Alert,
  ActivityIndicator,
} from 'react-native';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';

export default function Entrar() {
  const navigation = useNavigation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Campos Obrigatórios', 'Por favor, informe seu e-mail e senha.');
      return;
    }

    setIsLoading(true);

    const result = await login(email.trim().toLowerCase(), password);

    setIsLoading(false);

    if (result.success) {
      // Login bem-sucedido -> navega direto para o Território
      navigation.replace('Territorio');
    } else {
      Alert.alert('Erro no Login', result.error);
    }
  };

  return (
    <ImageBackground
      style={styles.container}
      source={require('../../../assets/fundo3.png')}
      resizeMode="cover"
    >
      <View style={styles.form}>
        <Text style={styles.text}>Email:</Text>
        <TextInput
          placeholder="Digite Aqui"
          placeholderTextColor="#666"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.text}>Senha:</Text>
        <TextInput
          placeholder="Digite Aqui"
          placeholderTextColor="#666"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable
          style={styles.btn}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Fazer Login</Text>
          )}
        </Pressable>
      </View>
      <StatusBar style="auto" />
    </ImageBackground>
  );
}