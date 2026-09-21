import { StyleSheet, Platform } from 'react-native';

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
    paddingVertical: 12,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFE8B8',
    borderWidth: 2,
    borderColor: '#7A5229',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#3E2723',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerSpacer: {
    width: 44,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },

  // CARD DO ESCOTEIRO
  profileCard: {
    backgroundColor: '#FAF9F4',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0D8C3',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 16,
  },
  avatarSection: {
    position: 'relative',
    marginBottom: 12,
  },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#E8F5E9',
    borderWidth: 3.5,
    borderColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeLevel: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFB300',
    borderWidth: 2,
    borderColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeLevelText: {
    color: '#3E2723',
    fontSize: 13,
    fontWeight: '900',
  },
  userName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1B4332',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4E6E5D',
    marginBottom: 14,
  },

  // XP
  xpSection: {
    width: '100%',
    marginBottom: 16,
  },
  xpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  xpLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#555',
  },
  xpValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2E7D32',
  },
  xpBarBackground: {
    width: '100%',
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: '#43A047',
    borderRadius: 6,
  },

  // STATS
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8D8A0',
  },
  statIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  statNumber: {
    fontSize: 15,
    fontWeight: '900',
    color: '#2E382E',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#777',
    marginTop: 2,
  },

  // SEÇÕES DE CONTEÚDO
  sectionCard: {
    backgroundColor: '#FAF9F4',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E0D8C3',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EBE7DD',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2B2D42',
  },

  // CONQUISTAS
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#EAE6D8',
  },
  achievementItemCompleted: {
    borderColor: '#C8E6C9',
    backgroundColor: '#F1F8E9',
  },
  achievementIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  achievementIconDone: {
    backgroundColor: '#43A047',
  },
  achievementIconPending: {
    backgroundColor: '#E0E0E0',
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2E382E',
  },
  achievementDesc: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  achievementReward: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 8,
  },
  rewardText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#E65100',
  },

  // OPÇÕES DE ACESSIBILIDADE
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0ECE4',
  },
  optionInfo: {
    flex: 1,
    paddingRight: 10,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2E382E',
  },
  optionDesc: {
    fontSize: 11,
    color: '#777',
    marginTop: 2,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  infoRowLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },
  infoRowValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2E7D32',
  },

  // LOGOUT
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFEBEE',
    borderWidth: 1.5,
    borderColor: '#FFCDD2',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
    marginTop: 8,
  },
  logoutBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#D32F2F',
  },

  footerSpacing: {
    height: 40,
  },
});
