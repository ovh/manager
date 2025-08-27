import { SecurityOption } from '@/types/compatibilityMatrix';

export const getIsLogForwarderDelivered = (
  options: SecurityOption[] = [],
): boolean =>
  options?.some(
    (option) => option.name === 'logForwarder' && option.state === 'delivered',
  ) ?? false;
