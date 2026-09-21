import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 40) / 2;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  safeArea: {
    flex: 1,
  },

  alert: {
    width: CARD_WIDTH,
    height: 122,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },

  // ─── CABEÇALHO (Botão Voltar, Placa Central MAPA, Botão Perfil) ───
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  circleWoodBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#733E14',
    borderWidth: 2.5,
    borderColor: '#D4883B',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  placaTopo: {
    flex: 1,
    height: 85,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },

  // ─── GRID DE CARDS (2 COLUNAS) ───
  flatListContent: {
    paddingHorizontal: 12,
    paddingBottom: 110, // Espaço para a barra inferior de madeira
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cardContainer: {
    width: CARD_WIDTH,
    alignItems: 'center',
  },
  ilhaWrapper: {
    width: CARD_WIDTH,
    height: 122,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  ilhaImagem: {
    width: '100%',
    height: '100%',
  },
  ilhaBloqueadaImagem: {
    opacity: 0.42,
  },

  // ─── PLACA VERDE DE MADEIRA (Liberado) ───
  placaVerdeWrapper: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#2E7D32',
    borderRadius: 16,
    borderWidth: 2.5,
    borderColor: '#4CAF50',
    paddingVertical: 5,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -8,
    zIndex: 2,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  containerLiberado: {
    flexDirection: 'column',
    marginRight: 'auto',
    gap: 2,
    paddingHorizontal: 5,
    borderRadius: 10,
    marginTop: 3,
  },

  tituloVerde: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  liberadoText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFF',
  },

  cadeadoCircleOpen: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#90A4AE',
  },

  // ─── PLACA CINZA DE PEDRA (Bloqueado) ───
  placaCinzaWrapper: {
    width: '100%',
    backgroundColor: '#455A64',
    borderRadius: 16,
    borderWidth: 2.5,
    borderColor: '#78909C',
    paddingVertical: 8,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: -8,
    zIndex: 2,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  placaCinzaTextCol: {
    flex: 1,
    paddingRight: 4,
  },
  tituloCinza: {
    fontSize: 12,
    fontWeight: '900',
    color: '#ECEFF1',
    letterSpacing: 0.6,
  },
  requisitoCinza: {
    fontSize: 9,
    fontWeight: '700',
    color: '#B0BEC5',
    marginTop: 2,
  },
  cadeadoCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#37474F',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#90A4AE',
  },
});
