import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },

  // ─── HEADER ───
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E3A59',
    textShadowColor: 'rgba(255,255,255,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#546E7A',
    marginTop: 2,
  },

  // ─── BIOME TABS ───
  biomeTabsContainer: {
    maxHeight: 44,
    paddingLeft: 14,
  },
  biomeTabsContent: {
    paddingRight: 20,
    alignItems: 'center',
  },
  biomeTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.6)',
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  biomeTabActive: {
    backgroundColor: '#2E7D32',
    borderColor: '#1B5E20',
  },
  biomeTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#546E7A',
    letterSpacing: 0.5,
  },
  biomeTabTextActive: {
    color: '#ffffff',
  },

  // ─── ANIMAL CARDS ───
  animalListContent: {
    paddingHorizontal: 14,
    paddingBottom: 30,
    paddingTop: 10,
  },
  animalCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  animalCardImageWrapper: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: '#f0f4f8',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  animalCardImage: {
    width: 60,
    height: 60,
  },
  scientistBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FFF9C4',
    borderRadius: 10,
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFD54F',
  },
  scientistBadgeText: {
    fontSize: 12,
  },
  animalCardInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  animalCardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E3A59',
  },
  animalCardStage: {
    fontSize: 12,
    color: '#78909C',
    marginTop: 1,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#66BB6A',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 10,
    color: '#90A4AE',
    marginTop: 2,
  },

  // ─── DETAIL MODAL ───
  detailModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  detailModalContent: {
    backgroundColor: '#fafafa',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 30,
  },
  detailHeader: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#2E7D32',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  detailCloseBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  detailImage: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
  detailName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  detailScientific: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    fontStyle: 'italic',
  },
  scientistFullBadge: {
    backgroundColor: '#FFF9C4',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 8,
  },
  scientistFullBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#F57F17',
  },

  // ─── DETAIL SECTIONS ───
  detailSection: {
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E3A59',
    marginBottom: 8,
  },
  detailDescription: {
    fontSize: 14,
    color: '#546E7A',
    lineHeight: 20,
  },

  // ─── BOOK CARDS ───
  bookCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  bookCardRead: {
    backgroundColor: '#f1f8e9',
    borderColor: '#C8E6C9',
  },
  bookCardIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFF8E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookCardInfo: {
    flex: 1,
    marginLeft: 10,
  },
  bookCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E3A59',
  },
  bookCardXP: {
    fontSize: 11,
    color: '#78909C',
    marginTop: 1,
  },

  // ─── QUIZ CARDS ───
  quizCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  quizCardDone: {
    backgroundColor: '#E8F5E9',
    borderColor: '#C8E6C9',
  },
  quizCardIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quizCardInfo: {
    flex: 1,
    marginLeft: 10,
  },
  quizCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E3A59',
  },
  quizCardXP: {
    fontSize: 11,
    color: '#78909C',
    marginTop: 1,
  },

  // ─── SHORTCUT BUTTON ───
  shortcutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 4,
  },
  shortcutButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },

  // ─── BOOK MODAL ───
  bookModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  bookModalContent: {
    backgroundColor: '#FFF8E1',
    borderRadius: 20,
    padding: 24,
    maxHeight: '70%',
    width: '100%',
    borderWidth: 2,
    borderColor: '#FFD54F',
  },
  bookModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4E342E',
    textAlign: 'center',
  },
  bookModalDivider: {
    height: 2,
    backgroundColor: '#FFD54F',
    borderRadius: 1,
    marginVertical: 14,
  },
  bookModalText: {
    fontSize: 15,
    color: '#4E342E',
    lineHeight: 24,
  },
  bookModalButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  bookModalButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
