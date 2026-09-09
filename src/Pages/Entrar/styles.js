import { StyleSheet } from "react-native";

export default StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff', 
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 6,
    marginRight: "16.5%",
  },

  voltarBtnContainer: {
    marginRight: '5%',
  },

  circleWoodBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#733e14',
    borderWidth: 2.5,
    borderColor: '#d4883b',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#42240c',
    textAlign: 'center',
    marginBottom: 10,
  },

  subtittle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#42240c',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 10,
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
