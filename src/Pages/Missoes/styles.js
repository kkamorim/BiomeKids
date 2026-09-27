import { StyleSheet } from 'react-native';

import { palette, radius, shadows, spacing } from '../../theme/designSystem';

export default StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 122,
  },
  eyebrow: {
    marginTop: spacing.md,
    color: palette.textMuted,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.3,
  },
  title: {
    marginTop: spacing.xs,
    color: palette.textStrong,
    fontSize: 27,
    fontWeight: '900',
  },
  subtitle: {
    marginTop: spacing.sm,
    color: palette.textMuted,
    fontSize: 14,
    lineHeight: 21,
  },
  tabs: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    padding: spacing.xs,
    borderRadius: radius.lg,
    backgroundColor: palette.surfaceMuted,
  },
  tab: {
    flex: 1,
    minHeight: 43,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
  },
  tabActive: {
    backgroundColor: palette.surface,
    ...shadows.sm,
  },
  tabText: {
    color: palette.textMuted,
    fontSize: 12,
    fontWeight: '800',
  },
  tabTextActive: {
    color: palette.primaryDeep,
    fontWeight: '900',
  },
  card: {
    marginTop: spacing.md,
    padding: spacing.lg,
    borderWidth: 1.5,
    borderColor: palette.border,
    borderRadius: radius.xl,
    backgroundColor: palette.surface,
    ...shadows.sm,
  },
  cardDone: {
    borderColor: '#A9DC8A',
    backgroundColor: '#FAFFF7',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: palette.primarySoft,
  },
  cardCopy: {
    flex: 1,
    marginLeft: spacing.md,
    paddingRight: spacing.sm,
  },
  cardTitle: {
    color: palette.textStrong,
    fontSize: 15,
    fontWeight: '900',
  },
  cardDescription: {
    marginTop: spacing.xs,
    color: palette.textMuted,
    fontSize: 11,
    lineHeight: 16,
  },
  progressNumber: {
    color: palette.primaryDeep,
    fontSize: 12,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  progressTrack: {
    height: 9,
    marginTop: spacing.lg,
    overflow: 'hidden',
    borderRadius: radius.pill,
    backgroundColor: palette.disabledSurface,
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: palette.primary,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  reward: {
    flex: 1,
    color: palette.text,
    fontSize: 11,
    fontWeight: '800',
  },
  claimButton: {
    minWidth: 106,
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: palette.primary,
  },
  claimDisabled: {
    backgroundColor: palette.disabledSurface,
  },
  claimText: {
    color: palette.inverseText,
    fontSize: 11,
    fontWeight: '900',
  },
  claimed: {
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  claimedText: {
    color: palette.success,
    fontSize: 11,
    fontWeight: '900',
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.xl,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: '#FFF7DC',
  },
  tipEmoji: {
    fontSize: 25,
  },
  tipText: {
    flex: 1,
    color: '#6F5A21',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 18,
  },
});
