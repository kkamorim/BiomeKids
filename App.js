import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';     
import * as NavigationBar from 'expo-navigation-bar';

import Carregar from './src/Pages/Carregar';
import Home from './src/Pages/Home'; 
import Cadastro from './src/Pages/Cadastro';
import Entrar from './src/Pages/Entrar';
import Mapa from './src/Pages/Mapa';
import Territorio1 from './src/Pages/Territorio1';
import Territorio2 from './src/Pages/Territorio2';
import Territorio3 from './src/Pages/Territorio3';
import Territorio4 from './src/Pages/Territorio4';
import Territorio5 from './src/Pages/Territorio5';
import Territorio6 from './src/Pages/Territorio6'; 

import { AuthProvider } from './src/contexts/AuthContext';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    if (Platform.OS === 'android') {
      // Oculta os botões virtuais do sistema (Voltar, Home, Janelas)
      NavigationBar.setVisibilityAsync('hidden');
      // Modo imersivo: ao deslizar da borda, aparece translúcido e se esconde sozinho sem empurrar o app
      NavigationBar.setBehaviorAsync('overlay-swipe');
    }
  }, []);

  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Carregar">

        
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
            headerTitleAlign:"center",
            title:'Bem-Vindo',
            headerStyle: { backgroundColor: '#fff'},
            headerTintColor: 'black',
            headerShown:false,
            headerShadowVisible: false,
            width:"100%",
            flex:1, 
          }} 
        />


        <Stack.Screen 
          name='Cadastro' 
          component={Cadastro}
          options={{
            headerTitleAlign:"center",
            title: 'Criar Conta',
            headerStyle: { backgroundColor: '#fff' },
            headerTintColor: 'black',
            headerShadowVisible: false,
          }} 
        />

        <Stack.Screen 
          name='Entrar' 
          component={Entrar}
          options={{
            headerTitleAlign:"center",
            title: 'Entrar',
            headerStyle: { backgroundColor: '#fff' },
            headerTintColor: 'black',
            headerShadowVisible: false,
          }} 
        />

        <Stack.Screen 
          name='Mapa' 
          component={Mapa}
          options={{
            headerShown: false,
          }} 
        />

        <Stack.Screen 
          name='Territorio1' 
          component={Territorio1}
          options={{
            headerTitleAlign:"center",
            title: 'Território 1',
            headerStyle: { backgroundColor: '#584737' },
            headerTintColor: 'white',
          }} 
        />  
        
           
        <Stack.Screen 
          name='Territorio2' 
          component={Territorio2}
          options={{
            headerTitleAlign:"center",
            title: 'Território 2',
            headerStyle: { backgroundColor: '#584737' },
            headerTintColor: 'white',
          }} 
        />  
        
        <Stack.Screen 
          name='Territorio3' 
          component={Territorio3}
          options={{
            headerTitleAlign:"center",
            title: 'Território 3',
            headerStyle: { backgroundColor: '#584737' },
            headerTintColor: 'white',
          }} 
        />   

        <Stack.Screen 
          name='Territorio4' 
          component={Territorio4}
          options={{
            headerTitleAlign:"center",
            title: 'Território 4',
            headerStyle: { backgroundColor: '#584737' },
            headerTintColor: 'white',
          }} 
        />   

        <Stack.Screen 
          name='Territorio5' 
          component={Territorio5}
          options={{
            headerTitleAlign:"center",
            title: 'Território 5',
            headerStyle: { backgroundColor: '#584737' },
            headerTintColor: 'white',
          }} 
        />   

        <Stack.Screen 
          name='Territorio6' 
          component={Territorio6}
          options={{
            headerTitleAlign:"center",
            title: 'Território 6',
            headerStyle: { backgroundColor: '#584737' },
            headerTintColor: 'white',
          }} 
        />   
      </Stack.Navigator>
    </NavigationContainer>
  </AuthProvider>
  );
}

