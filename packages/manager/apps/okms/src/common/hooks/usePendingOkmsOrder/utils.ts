import { OKMS } from '@key-management-service/types/okms.type';

/**
 * Check if the order creation has expired
 * @param createdAt - The date and time the order was created
 * @param expirationInMs - The number of milliseconds after which the order will expire
 * @returns True if the order has expired, false otherwise
 */
export const isOrderExpired = (
  createdAt: string,
  expirationInMs: number,
): boolean => {
  const expirationTime = new Date(createdAt).getTime() + expirationInMs;
  return Date.now() > expirationTime;
};

/**
 * Find new OKMSs in the list
 * @param initialOkmsIds - The list of initial OKMS ids
 * @param okmsList - The list of OKMSs
 * @returns The new OKMS id if found, undefined otherwise
 */
export const findNewOkmsId = (
  initialOkmsIds: string[],
  okmsList: OKMS[],
): OKMS | undefined => {
  return okmsList.find(
    (okms) => !initialOkmsIds.some((initial) => initial === okms.id),
  );
};
