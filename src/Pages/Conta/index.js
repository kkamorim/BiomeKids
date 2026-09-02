import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Text,
  View,
  Pressable,
  TextInput,
  ImageBackground,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';

export default function Conta() {
  const navigation = useNavigation();
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [cep, setCep] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [lgpdConsent, setLgpdConsent] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    // Validações básicas no cliente
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Campos Obrigatórios', 'Por favor, preencha nome, e-mail e senha.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Senha Curta', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Senhas Diferentes', 'A confirmação de senha não coincide com a senha.');
      return;
    }

    if (!lgpdConsent) {
      Alert.alert(
        'Consentimento LGPD',
        'É necessário concordar com os Termos de Uso e Política de Privacidade para criar sua conta.'
      );
      return;
    }

    setIsLoading(true);

    const result = await register({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      password,
      birthDate: birthDate ? birthDate : null,
      cep: cep ? cep.trim() : null,
      lgpdConsent: true,
      termsVersion: '1.0',
    });

    setIsLoading(false);

    if (result.success) {
      // Redireciona diretamente para o ecossistema principal
      navigation.replace('Territorio');
    } else {
      Alert.alert('Erro no Cadastro', result.error);
    }
  };

  return (
    <ImageBackground
      style={styles.container}
      source={require('../../../assets/fundo3.png')}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={{ alignItems: 'center', paddingVertical: 30 }}
        style={{ width: '100%' }}
      >
        <View style={styles.form}>
          <View style={styles.formText}>
            <Text style={styles.text}>Nome Completo:</Text>
            <TextInput
              placeholder="Digite Aqui:"
              placeholderTextColor="#666"
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />

            <Text style={styles.text}>Data de Nascimento:</Text>
            <TextInput
              placeholder="AAAA-MM-DD"
              placeholderTextColor="#666"
              style={styles.input}
              value={birthDate}
              onChangeText={setBirthDate}
            />

            <Text style={styles.text}>CEP:</Text>
            <TextInput
              placeholder="00000-000"
              placeholderTextColor="#666"
              style={styles.input}
              value={cep}
              onChangeText={setCep}
              keyboardType="numeric"
            />

            <Text style={styles.text}>Email:</Text>
            <TextInput
              placeholder="Digite Aqui:"
              placeholderTextColor="#666"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.text}>Senha:</Text>
            <TextInput
              placeholder="Digite Aqui:"
              placeholderTextColor="#666"
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Text style={styles.text}>Verificação de Senha:</Text>
            <TextInput
              placeholder="Repita Sua Senha Aqui:"
              placeholderTextColor="#666"
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            <Pressable
              style={styles.btn}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Criar Conta</Text>
              )}
            </Pressable>
          </View>
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </ImageBackground>
  );
}

