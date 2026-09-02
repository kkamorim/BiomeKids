import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 80,
    paddingBottom: 60,
  },

  placaContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  placa: {
    width: 300,
    height: 200,
    marginBottom: 130,
  },

  loadingWrapper: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 25,
    marginBottom: 50,
  },

  loadingText: {
    color: '#42240c',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textShadowColor: 'rgba(255, 255, 255, 0.7)',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 3,
    letterSpacing: 0.5,
  },

  progressBarTrack: {
    width: '90%',
    maxWidth: 340,
    height: 32,
    backgroundColor: '#351605',
    borderRadius: 18,
    borderWidth: 2.5,
    borderColor: '#e5ab47',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 6,
  },

  progressBarFill: {
    height: '100%',
    borderRadius: 15,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  gradientFill: {
    ...StyleSheet.absoluteFillObject,
  },

  glossHighlight: {
    position: 'absolute',
    top: 2,
    left: 8,
    right: 8,
    height: 7,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderRadius: 4,
  },

  pawContainer: {
    paddingRight: 6,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },

  pawIcon: {
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

