export type TStatusColor = 'success' | 'critical' | 'warning' | 'information';

type TGetStatusColorFn<T extends string> = (
  status: T | undefined,
  statusMap: Record<T, TStatusColor>,
  fallback?: TStatusColor,
) => TStatusColor;

export const getStatusColor: TGetStatusColorFn<string> = (
  status,
  statusMap,
  fallback = 'information',
) => {
  return status && statusMap[status] ? statusMap[status] : fallback;
};
