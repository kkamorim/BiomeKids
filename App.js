import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as NavigationBar from 'expo-navigation-bar';

import Carregar from './src/Pages/Carregar';
import Home from './src/Pages/Home';
import Cadastro from './src/Pages/Cadastro';
import Entrar from './src/Pages/Entrar';
import Journey from './src/Pages/Journey';
import Lesson from './src/Pages/Lesson';
import Expedition from './src/Pages/Expedition';
import Evolution from './src/Pages/Evolution';
import Transition from './src/Pages/Transition';
import Biomas from './src/Pages/Biomas';
import Missoes from './src/Pages/Missoes';
import Colecao from './src/Pages/Colecao';
import Loja from './src/Pages/Loja';
import Perfil from './src/Pages/Perfil';

import { AuthProvider } from './src/contexts/AuthContext';
import { GameProvider } from './src/contexts/GameContext';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerShown: false,
  animation: 'fade',
  contentStyle: { backgroundColor: '#F7FBF4' },
};

export default function App() {
  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden').catch(() => {});
    }
  }, []);

  return (
    <AuthProvider>
      <GameProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName={'Carregar'} screenOptions={screenOptions}>
            <Stack.Screen name={'Carregar'} component={Carregar} />
            <Stack.Screen name={'Home'} component={Home} />
            <Stack.Screen name={'Cadastro'} component={Cadastro} />
            <Stack.Screen name={'Entrar'} component={Entrar} />

            <Stack.Screen name={'Journey'} component={Journey} />
            <Stack.Screen name={'Lesson'} component={Lesson} options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name={'Expedition'} component={Expedition} options={{ animation: 'fade' }} />
            <Stack.Screen name={'Evolution'} component={Evolution} options={{ animation: 'slide_from_bottom' }} />
            <Stack.Screen name={'Transition'} component={Transition} options={{ animation: 'fade' }} />
            <Stack.Screen name={'Biomas'} component={Biomas} />
            <Stack.Screen name={'Missoes'} component={Missoes} />
            <Stack.Screen name={'Colecao'} component={Colecao} />
            <Stack.Screen name={'Loja'} component={Loja} />
            <Stack.Screen name={'Perfil'} component={Perfil} />
          </Stack.Navigator>
        </NavigationContainer>
      </GameProvider>
    </AuthProvider>
  );
}
