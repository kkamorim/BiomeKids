import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F2FE', // Céu suave de fundo
  },

  // Camada do Mapa Isométrico 2.5D
  mapLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },

  // Camada HUD 2D Overlay
  hudOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    justifyContent: 'space-between',
  },

  // 1. CABEÇALHO GLOBAL (Voltar, Badge do Bioma, Moedas e Diamantes à Direita)
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: Platform.OS === 'android' ? 12 : 8,
  },

  circleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#733E14',
    borderWidth: 2,
    borderColor: '#D4883B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },

  biomeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E7D32',
    borderWidth: 2,
    borderColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    maxWidth: width * 0.45,
  },

  biomeBadgeIcon: {
    fontSize: 15,
    marginRight: 6,
  },

  biomeBadgeText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
    marginRight: 4,
    letterSpacing: 0.5,
  },

  // DICA FLUTUANTE
  hintContainer: {
    alignSelf: 'center',
    backgroundColor: 'rgba(26, 32, 44, 0.76)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 18,
    marginTop: 6,
    maxWidth: width * 0.88,
  },

  hintText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },

  // BOTÃO FLUTUANTE DE MODO EDIÇÃO
  editModeToggleBtn: {
    position: 'absolute',
    bottom: 90, // Fica acima da barra de navegação de madeira
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E65100',
    borderWidth: 2,
    borderColor: '#FFB74D',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 22,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },

  editModeToggleBtnActive: {
    backgroundColor: '#2E7D32',
    borderColor: '#A5D6A7',
  },

  editModeToggleText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '900',
  },

  // MODAL DE CUIDADOS COM O ANIMAL
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  careCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FAF9F4',
    borderRadius: 26,
    padding: 20,
    borderWidth: 2,
    borderColor: '#D7CCC8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },

  careHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  careAvatar: {
    fontSize: 34,
    marginRight: 12,
  },

  careTitleWrapper: {
    flex: 1,
  },

  careAnimalName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1B4332',
  },

  careAnimalSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },

  careCloseBtn: {
    padding: 4,
  },

  successToast: {
    backgroundColor: '#D8F3DC',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#B7E4C7',
  },

  successToastText: {
    color: '#1B4332',
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
  },

  careActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 16,
  },

  careBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E8D8A0',
    elevation: 2,
  },

  careBtnIcon: {
    fontSize: 24,
    marginBottom: 4,
  },

  careBtnLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2B2D42',
  },

  careBtnReward: {
    fontSize: 11,
    fontWeight: '900',
    color: '#E65100',
    marginTop: 4,
  },

  studyShortcutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 14,
    paddingVertical: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },

  studyShortcutText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2D6A4F',
  },

  // MODAL DE CONSTRUÇÃO NO LOTE
  buildCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FAF9F4',
    borderRadius: 24,
    padding: 20,
    borderWidth: 2,
    borderColor: '#FFE082',
  },

  buildHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  buildTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#3E2723',
  },

  buildSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 14,
  },

  buildOptionsGrid: {
    gap: 10,
  },

  buildOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#E0D8C3',
  },

  buildOptionIcon: {
    fontSize: 28,
    marginRight: 12,
  },

  buildOptionName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    color: '#2E382E',
  },

  buildOptionPrice: {
    fontSize: 12,
    fontWeight: '900',
    color: '#E65100',
  },

  // MODAL DE ESTRUTURA
  structureCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FAF9F4',
    borderRadius: 24,
    padding: 22,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#90CAF9',
  },

  structureCardIcon: {
    fontSize: 42,
    marginBottom: 10,
  },

  structureCardTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0D47A1',
    textAlign: 'center',
    marginBottom: 8,
  },

  structureCardDesc: {
    fontSize: 13,
    color: '#455A64',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },

  structureCardCloseBtn: {
    backgroundColor: '#0288D1',
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 16,
  },

  structureCardCloseText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },

  // MODAL SELETOR DE BIOMAS
  pickerContainer: {
    width: '100%',
    maxWidth: 380,
    maxHeight: '80%',
    backgroundColor: '#FAF9F4',
    borderRadius: 26,
    padding: 20,
    borderWidth: 2,
    borderColor: '#D7CCC8',
  },

  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EBE7DD',
  },

  pickerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1B4332',
  },

  pickerScroll: {
    paddingBottom: 10,
  },

  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EAE6D8',
  },

  pickerItemSelected: {
    backgroundColor: '#E8F5E9',
    borderColor: '#2D6A4F',
    borderWidth: 1.5,
  },

  colorPreview: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },

  pickerItemTextWrapper: {
    flex: 1,
  },

  pickerItemName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2B2D42',
  },

  pickerItemNameSelected: {
    color: '#1B4332',
  },

  pickerItemSub: {
    fontSize: 11,
    color: '#7F8C8D',
    marginTop: 2,
  },
});
