export const DatasourceConfiguration = {
  AUTOMATIC: 'automatic' as const,
  MANUAL: 'manual' as const,
} as const;

export type DatasourceConfiguration =
  (typeof DatasourceConfiguration)[keyof typeof DatasourceConfiguration];
