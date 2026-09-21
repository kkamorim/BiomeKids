import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';     
import { NavigationBar } from 'expo-navigation-bar';

import Carregar from './src/Pages/Carregar';
import Home from './src/Pages/Home'; 
import Cadastro from './src/Pages/Cadastro';
import Entrar from './src/Pages/Entrar';
import Biomas from './src/Pages/Biomas';
import Estudos from './src/Pages/Estudos';
import Missoes from './src/Pages/Missoes';
import Colecao from './src/Pages/Colecao';
import Loja from './src/Pages/Loja';
import Perfil from './src/Pages/Perfil';
import BiomeMapScreen from './src/Pages/BiomeMap/BiomeMapScreen';
import QuizScreen from './src/Pages/Estudos/QuizScreen';
import Territorio1 from './src/Pages/Territorio1';
import Territorio2 from './src/Pages/Territorio2';
import Territorio3 from './src/Pages/Territorio3';
import Territorio4 from './src/Pages/Territorio4';
import Territorio5 from './src/Pages/Territorio5';
import Territorio6 from './src/Pages/Territorio6'; 

import { AuthProvider } from './src/contexts/AuthContext';
import { GameProvider } from './src/contexts/GameContext';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    if (Platform.OS === 'android') {
      // Oculta os botões virtuais do sistema
      NavigationBar.setHidden(true);
    }
  }, []);

  return (
    <AuthProvider>
      <GameProvider>
        <NavigationBar hidden={true} />
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Carregar">
            {/* ─── TELAS DE ENTRADA / AUTH ─── */}
            <Stack.Screen 
              name='Carregar'
              component={Carregar}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen 
              name='Home'
              component={Home}
              options={{
                headerShown: false,
              }} 
            />

            <Stack.Screen 
              name='Cadastro' 
              component={Cadastro}
              options={{
                headerShown: false,
              }} 
            />

            <Stack.Screen 
              name='Entrar' 
              component={Entrar}
              options={{
                headerShown: false,
              }} 
            />

            {/* ─── NAVEGAÇÃO PRINCIPAL (BARRA INFERIOR DE MADEIRA) ─── */}
            {/* 1. Estudos */}
            <Stack.Screen 
              name='Estudos' 
              component={Estudos}
              options={{
                headerShown: false,
              }} 
            />

            {/* 2. Missões */}
            <Stack.Screen 
              name='Missoes' 
              component={Missoes}
              options={{
                headerShown: false,
              }} 
            />
            <Stack.Screen 
              name='Missões' 
              component={Missoes}
              options={{
                headerShown: false,
              }} 
            />

            {/* 3. Mapa Geral de Biomas */}
            <Stack.Screen 
              name='Biomas' 
              component={Biomas}
              options={{
                headerShown: false,
              }} 
            />
            <Stack.Screen 
              name='Mapa' 
              component={Biomas}
              options={{
                headerShown: false,
              }} 
            />

            {/* 4. Coleção */}
            <Stack.Screen 
              name='Colecao' 
              component={Colecao}
              options={{
                headerShown: false,
              }} 
            />
            <Stack.Screen 
              name='Coleção' 
              component={Colecao}
              options={{
                headerShown: false,
              }} 
            />

            {/* 5. Loja */}
            <Stack.Screen 
              name='Loja' 
              component={Loja}
              options={{
                headerShown: false,
              }} 
            />

            {/* ─── MAPA ISOMÉTRICO 2.5D DO BIOMA SELECIONADO ─── */}
            <Stack.Screen 
              name='BiomeMap' 
              component={BiomeMapScreen}
              options={{
                headerShown: false,
              }} 
            />

            {/* ─── PERFIL DO ESCOTEIRO (COM LOGOUT E ACESSIBILIDADE) ─── */}
            <Stack.Screen 
              name='Perfil' 
              component={Perfil}
              options={{
                headerShown: false,
              }} 
            />

            {/* ─── QUIZ DE ESTUDOS ─── */}
            <Stack.Screen 
              name='QuizScreen' 
              component={QuizScreen}
              options={{
                headerShown: false,
              }} 
            />

            {/* ─── TERRITÓRIOS LEGADOS / DETALHADOS ─── */}
            <Stack.Screen 
              name='Territorio1' 
              component={Territorio1}
              options={{
                headerTitleAlign: "center",
                title: 'Território 1',
                headerStyle: { backgroundColor: '#584737' },
                headerTintColor: 'white',
              }} 
            />  
            
            <Stack.Screen 
              name='Territorio2' 
              component={Territorio2}
              options={{
                headerTitleAlign: "center",
                title: 'Território 2',
                headerStyle: { backgroundColor: '#584737' },
                headerTintColor: 'white',
              }} 
            />  
            
            <Stack.Screen 
              name='Territorio3' 
              component={Territorio3}
              options={{
                headerTitleAlign: "center",
                title: 'Território 3',
                headerStyle: { backgroundColor: '#584737' },
                headerTintColor: 'white',
              }} 
            />   

            <Stack.Screen 
              name='Territorio4' 
              component={Territorio4}
              options={{
                headerTitleAlign: "center",
                title: 'Território 4',
                headerStyle: { backgroundColor: '#584737' },
                headerTintColor: 'white',
              }} 
            />   

            <Stack.Screen 
              name='Territorio5' 
              component={Territorio5}
              options={{
                headerTitleAlign: "center",
                title: 'Território 5',
                headerStyle: { backgroundColor: '#584737' },
                headerTintColor: 'white',
              }} 
            />   

            <Stack.Screen 
              name='Territorio6' 
              component={Territorio6}
              options={{
                headerTitleAlign: "center",
                title: 'Território 6',
                headerStyle: { backgroundColor: '#584737' },
                headerTintColor: 'white',
              }} 
            />   
          </Stack.Navigator>
        </NavigationContainer>
      </GameProvider>
    </AuthProvider>
  );
}
