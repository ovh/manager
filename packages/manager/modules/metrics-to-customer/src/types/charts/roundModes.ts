export const RoundingMode = {
  HALF_UP: 'half-up' as const,
  HALF_DOWN: 'half-down' as const,
  HALF_EVEN: 'half-even' as const,
  UP: 'up' as const,
  DOWN: 'down' as const,
  CEIL: 'ceil' as const,
  FLOOR: 'floor' as const,
} as const;

export type RoundingMode = (typeof RoundingMode)[keyof typeof RoundingMode];
