import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: Platform.OS === 'android' ? 10 : 16,
    paddingHorizontal: 8,
    zIndex: 999,
  },
  woodBarBackground: {
    width: width - 16,
    height: 76,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: '100%',
    paddingBottom: 6,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 232, 184, 0.3)',
  },
  iconCircleActive: {
    backgroundColor: 'rgba(46, 125, 50, 0.85)',
    borderColor: '#FFE082',
    transform: [{ scale: 1.05 }],
  },
  navText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFE8B8',
    marginTop: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  navTextActive: {
    color: '#FFF9C4',
    fontWeight: '900',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#E53935',
    minWidth: 17,
    height: 17,
    borderRadius: 8.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '900',
  },

  // BOTÃO CENTRAL DO MAPA
  centerItemWrapper: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -22, // Eleva acima da barra
  },
  centerButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerGlobeRing: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#2E7D32',
    borderWidth: 3.5,
    borderColor: '#FFE082',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.38,
    shadowRadius: 8,
    elevation: 8,
  },
  centerGlobeRingActive: {
    backgroundColor: '#1B5E20',
    borderColor: '#FFF',
    transform: [{ scale: 1.08 }],
    shadowColor: '#4CAF50',
    shadowOpacity: 0.6,
  },
  centerText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFE8B8',
    marginTop: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.85)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  centerTextActive: {
    color: '#FFF',
  },
});
