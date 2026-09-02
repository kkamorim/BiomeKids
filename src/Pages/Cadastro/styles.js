import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get('window');

export default StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  scrollContent: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingBottom: 60,
  },

  placaContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  placa: {
    width: 200,
    height: 160,
    marginBottom: 10,
  },

  tittle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#42240c',
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },

  form: {
    justifyContent: 'center',
    alignItems: "center",
    width: '100%',
    gap: 6,
    paddingBottom: 20,
  },

  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#42240c',
    alignSelf: "flex-start",
    marginLeft: 20,
    marginTop: 14,
    marginBottom: 4,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffffd9',
    borderRadius: 60,
    width: '90%',
    paddingHorizontal: 15,
    paddingVertical: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },

  inputDisabled: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8e8e8cc',
    borderRadius: 60,
    width: '90%',
    paddingHorizontal: 15,
    paddingVertical: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },

  icon: {
    padding: 5,
    position: "relative",
    marginTop: 5,
  },

  // ── Cidade / UF em linha ──
  rowContainer: {
    flexDirection: 'row',
    width: '90%',
    gap: 10,
  },

  rowItem: {
    flex: 1,
  },

  rowLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#42240c',
    marginTop: 14,
    marginBottom: 4,
    marginLeft: 5,
  },

  rowInputDisabled: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8e8e8cc',
    borderRadius: 60,
    paddingHorizontal: 15,
    paddingVertical: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },

  // ── CEP Loading ──
  cepLoading: {
    marginLeft: 8,
  },

  // ── Checkbox LGPD ──
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '88%',
    marginTop: 20,
    paddingHorizontal: 5,
  },

  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: '#42240c',
    marginLeft: 10,
    lineHeight: 20,
  },

  linkText: {
    color: '#1a6b0a',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },

  // ── Botão principal ──
  btn: {
    width: '60%',
    backgroundColor: '#47a51b',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },

  btnDisabled: {
    width: '60%',
    backgroundColor: '#8fbd7a',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },

  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },

  // ── Modal de Termos ──
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '100%',
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
    overflow: 'hidden',
  },

  modalHeader: {
    backgroundColor: '#47a51b',
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },

  modalCloseIcon: {
    padding: 4,
  },

  modalScrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 30,
  },

  modalSection: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#2d5a1e',
    marginTop: 20,
    marginBottom: 8,
  },

  modalSubSection: {
    fontSize: 15,
    fontWeight: '600',
    color: '#42240c',
    marginTop: 14,
    marginBottom: 6,
  },

  modalText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
    textAlign: 'justify',
    marginBottom: 8,
  },

  modalDivider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 16,
  },

  modalFooter: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  modalCloseBtn: {
    backgroundColor: '#47a51b',
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },

  modalCloseBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // ── Link voltar para login ──
  loginLink: {
    marginTop: 20,
    marginBottom: 10,
  },

  loginLinkText: {
    fontSize: 15,
    color: '#42240c',
    textAlign: 'center',
  },

  loginLinkBold: {
    fontWeight: 'bold',
    color: '#1a6b0a',
    textDecorationLine: 'underline',
  },
});