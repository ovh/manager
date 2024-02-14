import { ACTIVE_STATUS, PENDING_STATUS } from '@/constants';

export const userIsActive = (status: string): boolean =>
  ACTIVE_STATUS.includes(status);
export const userIsPending = (status: string): boolean =>
  PENDING_STATUS.includes(status);
