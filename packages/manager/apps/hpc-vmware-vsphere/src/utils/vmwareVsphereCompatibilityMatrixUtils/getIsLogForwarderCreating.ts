import { SecurityOption } from '@/types/compatibilityMatrix';

const FORWARDER_VALID_STATE = ['creating', 'pending', 'toCreate', 'updating'];

export const getIsLogForwarderCreating = (
  options: SecurityOption[] = [],
): boolean =>
  options?.some(
    (option) =>
      option.name === 'logForwarder' &&
      FORWARDER_VALID_STATE.includes(option.state),
  ) ?? false;
