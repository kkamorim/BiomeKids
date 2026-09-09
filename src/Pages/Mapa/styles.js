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

  // ─── CABEÇALHO (Botões de madeira e Placa Central) ───
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    paddingTop: 6,
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
  placaTopo: {
    flex: 1,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '12%',
  },

  diaryBtnWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    paddingLeft:5,
  },
  
  diaryBtnLabel: {
    color: '#42240c',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  // ─── FLATLIST & CARDS EM GRID (2 COLUNAS) ───
  flatListContent: {
    paddingHorizontal: 12,
    paddingBottom: 100, // Espaço para não cobrir o último item com o menu inferior
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginTop: 30,
  },
  cardContainer: {
    width: CARD_WIDTH,
    alignItems: 'center',
  },
  ilhaWrapper: {
    width: CARD_WIDTH,
    height: 118,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  ilhaImagem: {
    width: '100%',
    height: '100%',
  },

  // ─── PLACA LIBERADA (Pedra) ───
  placaLiberada: {
    width: '96%',
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -10,
    zIndex: 2,
  },
  tituloLiberado: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  badgeLiberado: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#275d0b',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 2,
  },
  textoBadgeLiberado: {
    color: '#ffffff',
    fontSize: 10.5,
    fontWeight: 'bold',
    marginRight: 4,
  },
  badgeIcon: {
    marginLeft: 2,
  },

  // ─── PLACA BLOQUEADA (Pedra Escura) ───
  placaBloqueada: {
    width: '100%',
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -10,
    zIndex: 2,
  },
  tituloBloqueado: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#e4ebf2',
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bloqueadoInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  requisitoTexto: {
    color: '#cbd5e1',
    fontSize: 9,
    fontWeight: '600',
    flex: 1,
    paddingRight: 4,
    lineHeight: 12,
    textAlign: 'center',
  },
  cadeadoCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#282c33',
    borderWidth: 1,
    borderColor: '#1a1d22',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ─── BARRA DE NAVEGAÇÃO INFERIOR (Estilo Tábua de Madeira) ───
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 20,
  },
  bottomBarPlank: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#573010',
    borderTopWidth: 3,
    borderColor: '#93531f',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingTop: 8,
    paddingBottom: 16,
    paddingHorizontal: 6,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#402107',
    borderWidth: 1.5,
    borderColor: '#824919',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    color: '#ffdca3',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 3,
  },
  tabItemActive: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginTop: -22, // Eleva o globo do mapa em destaque
  },
  activeGlobeCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#388e3c',
    borderWidth: 3.5,
    borderColor: '#81c784',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 5,
  },
  tabLabelActive: {
    color: '#a5d6a7',
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 2,
  },
  badgeNotificacao: {
    position: 'absolute',
    top: -4,
    right: -5,
    backgroundColor: '#e53935',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
    borderColor: '#ffffff',
    paddingHorizontal: 2,
  },
  badgeNotificacaoTexto: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: 'bold',
  },
});