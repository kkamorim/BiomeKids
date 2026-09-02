import { StyleSheet } from "react-native";

export default StyleSheet.create({


  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  placaContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  placa: {
    width: 240,
    height: 200,
    marginBottom: 20,
  },

  containerText: {
    marginTop: 50,
    alignItems: 'center',
    flex:1,
  },

  tittle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#42240c',
    textAlign: 'center',
    marginBottom: 10,
  },

  subtittle: {
    fontSize: 16,
    fontWeight:'bold',
    color: '#42240c',
    textAlign: 'center',
    opacity: 0.85,
    paddingHorizontal: 8,
  },

  btnContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },

  btnEntrar: {
    width: '60%',
    backgroundColor: '#47a51b',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },

  btnEntrarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },

  btnCadastro: {
    width: '60%',
    backgroundColor: '#16B5F6',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },

  btnCadastroText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },


});