export const CurveType = {
  BASIS: 'basis' as const,
  BASIS_CLOSED: 'basisClosed' as const,
  BASIS_OPEN: 'basisOpen' as const,
  BUMP_X: 'bumpX' as const,
  BUMP_Y: 'bumpY' as const,
  BUMP: 'bump' as const,
  LINEAR: 'linear' as const,
  LINEAR_CLOSED: 'linearClosed' as const,
  NATURAL: 'natural' as const,
  MONOTONE_X: 'monotoneX' as const,
  MONOTONE_Y: 'monotoneY' as const,
  MONTONE: 'monotone' as const,
  STEP: 'step' as const,
  STEP_BEFORE: 'stepBefore' as const,
  STEP_AFTER: 'stepAfter' as const,
} as const;

export type CurveType = (typeof CurveType)[keyof typeof CurveType];
