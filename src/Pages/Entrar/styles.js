import { StyleSheet } from "react-native";

export default StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#cde1c9', 
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  form: {
    borderWidth: 3,
    flex: 0.4,
    justifyContent: 'center',
    alignItems: "center",
    borderRadius: 20, 
    borderColor: '#7ca47b', 
    backgroundColor: '#ffffff80', 
    width: '90%',
    height: '100%',
    marginBottom:100,
  },

  text: {
    fontSize: 18,
    marginTop: 10,
    color: '#2f422f', 
  },

  input: {
    backgroundColor: '#00000020',
    borderRadius: 8,
    padding: 10,
    width: '90%', 
    marginBottom: 15, 
  },

  btn: {
    backgroundColor: '#7ca47b',
    borderWidth:1,
    borderColor:"#2f422f", 
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    width: 200,
    shadowColor: '#000',
    color:"#ffffff",
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    marginTop:20,
  },

  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 22,
  },
});
