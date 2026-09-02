import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  TextInput,
  View,
  Pressable,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
  Image,
  ImageBackground,
} from 'react-native';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function Entrar() {
  const navigation = useNavigation();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

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
      source={require('../../../assets/fundo-selva.png')}
      resizeMode="cover"
    >

      <View style={styles.placaContainer}>
        <Image
          style={styles.placa}
          source={require('../../../assets/placa-biomekids.png')}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.tittle}>Digite seus dados de escoteiro para continuar explorando.</Text>

      <View style={styles.form}>
        <Text style={styles.text}><Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} /> Email:</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={{ width: "100%" }}
            placeholder="Digite Seu Email"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <Text style={styles.text}><Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} /> Senha:</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={{ flex: 1 }}
            placeholder="Digite Sua Senha"
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons style={styles.icon}
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>
        {/* ── Link para Cadastro ── */}
        <TouchableOpacity
          style={styles.CadastroLink}
          onPress={() => navigation.navigate('Cadastro')}
        >
          <Text style={styles.CadastroLinkText}>
            Não tem uma conta?{' '}
            <Text style={styles.CadastroLinkBold}>Cadastre-se</Text>
          </Text>
        </TouchableOpacity>

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
