import { StyleSheet } from 'react-native';

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
  categoryRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginVertical: 10,
  },
  categoryBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1.5,
    borderColor: '#D7CCC8',
    alignItems: 'center',
  },
  categoryBtnActive: {
    backgroundColor: '#2E7D32',
    borderColor: '#1B5E20',
  },
  categoryBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#5D4037',
  },
  categoryBtnTextActive: {
    color: '#FFF',
  },
  itemsScroll: {
    paddingHorizontal: 16,
    paddingTop: 6,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF9F4',
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#E0D8C3',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  itemIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8E4D8',
    marginRight: 12,
  },
  itemIconEmoji: {
    fontSize: 28,
  },
  itemInfo: {
    flex: 1,
    paddingRight: 8,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2E382E',
  },
  itemDesc: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
    lineHeight: 16,
  },
  buyBtn: {
    backgroundColor: '#F57C00',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 72,
    elevation: 2,
  },
  buyBtnDisabled: {
    backgroundColor: '#BDBDBD',
  },
  buyBtnPrice: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFF',
  },
  buyBtnLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFF',
  },
});
