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

  tittle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#42240c',
    textAlign: 'center',
    marginBottom: 20,
  },

  form: {
    flex: 1,
    justifyContent: 'center',
    alignItems: "center",
    width: '100%',
    height: '100%',
    marginBottom:100,
    gap:10,
  },

  text: {
    fontSize: 18,
    color: '#42240c',
    alignItems:"right",
    alignSelf:"flex-start",
    marginLeft:20,
    marginTop:20,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffffd9',
    borderRadius: 60,
    width: '90%',
    paddingHorizontal: 15,
    paddingVertical:3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },

  icon:{
    padding: 5,
    position:"relative",
    marginTop:5,
    alignSelf:'right',
  },

  CadastroLink: {
    marginTop: 20,
    marginBottom: 10,
  },

  CadastroLinkText: {
    fontSize: 15,
    color: '#42240c',
    textAlign: 'center',
  },

  CadastroLinkBold: {
    fontWeight: 'bold',
    color: '#1a6b0a',
    textDecorationLine: 'underline',
  },

  btn: {
    width: '60%',
    backgroundColor: '#47a51b',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
    justifyContent:'center',
    alignItems:'center',
  },

  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
