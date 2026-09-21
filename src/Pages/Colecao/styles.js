import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
  },
  titleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#3E2723',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#4E6E5D',
    fontWeight: '600',
    marginTop: 2,
  },
  biomeScroll: {
    maxHeight: 46,
    marginVertical: 8,
  },
  biomeScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  biomePill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1.5,
    borderColor: '#D7CCC8',
  },
  biomePillActive: {
    backgroundColor: '#2E7D32',
    borderColor: '#1B5E20',
  },
  biomePillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#5D4037',
  },
  biomePillTextActive: {
    color: '#FFF',
  },
  gridContent: {
    paddingHorizontal: 16,
    paddingTop: 6,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  animalCard: {
    width: cardWidth,
    backgroundColor: '#FAF9F4',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E0D8C3',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  animalCardLocked: {
    opacity: 0.7,
    backgroundColor: '#ECEFF1',
  },
  cardImageContainer: {
    width: '100%',
    height: 105,
    borderRadius: 14,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E8E4D8',
  },
  animalImg: {
    width: '90%',
    height: '90%',
  },
  animalImgLocked: {
    tintColor: '#78909C',
    opacity: 0.4,
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  animalName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2E382E',
    marginTop: 8,
    textAlign: 'center',
  },
  stageTag: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 5,
  },
  stageTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2E7D32',
  },

  // MODAL DETALHE
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    maxHeight: '80%',
    backgroundColor: '#FAF9F4',
    borderRadius: 24,
    padding: 20,
    borderWidth: 2,
    borderColor: '#D7CCC8',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#2E382E',
  },
  modalImage: {
    width: '100%',
    height: 160,
    borderRadius: 16,
    backgroundColor: '#FFF',
    marginBottom: 10,
  },
  modalScientificName: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#555',
    marginBottom: 8,
  },
  modalDescScroll: {
    maxHeight: 180,
  },
  modalDescText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#333',
  },
  curiosityBox: {
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  curiosityTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#E65100',
    marginBottom: 2,
  },
  curiosityText: {
    fontSize: 12,
    color: '#5D4037',
    lineHeight: 18,
  },
});
