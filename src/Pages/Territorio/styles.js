import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const itemSize = (width - 48) / 2;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cde1c9',
    padding: 16,
  },
  itemBase: {
    width: itemSize,
    height: itemSize,
    borderRadius: itemSize / 2,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
  },
  text: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  btn1: {
    backgroundColor: '#75b0cd',
    width:120,
    height:120,
    borderRadius:"50%",
    marginLeft:50,
    marginTop:90,
    borderWidth:3,
    borderColor: "#486d9f",
  },

  btn2: {
    backgroundColor: '#ffa028',
    width:120,
    height:120,
    borderRadius:"50%",
    marginRight:50,
    marginTop:90,
    borderWidth:3,
    borderColor:"#ffcb76",
  },
  btn3: {
    backgroundColor: '#3e6640',
    width:120,
    height:120,
    borderRadius:"50%",
    marginTop:90,
    marginLeft:50,
    borderWidth:3,
    borderColor:"#459e49",
  },
  btn4: {
    backgroundColor: '#7d429c',
    width:120,
    height:120,
    borderRadius:"50%",
    marginTop:90,
    marginRight:50,
    borderWidth:3,
    borderColor:"#a077b1",
  },
  btn5: {
    backgroundColor: '#5a482b',
    width:120,
    height:120,
    borderRadius:"50%",
    marginTop:90,
    marginLeft:50,
    borderWidth:3,
    borderColor:"#7c542c",
  },
  btn6: {
    backgroundColor: '#df5596',
    width:120,
    height:120,
    borderRadius:"50%",
    marginTop:90,
    marginRight:50,
    borderWidth:3,
    borderColor:"#b9008f",
  },
});