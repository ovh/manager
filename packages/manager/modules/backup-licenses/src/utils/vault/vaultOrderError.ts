import { TApiCustomError } from '@ovh-ux/manager-core-api';

/** Marks a message that comes from the API and must be rendered as-is, never looked up in i18n. */
export const VAULT_ORDER_SERVER_ERROR_TYPE = 'server';

export const getVaultOrderErrorMessage = (error?: TApiCustomError | null): string | undefined =>
  error?.response?.data?.message || undefined;

/**
 * The two statuses that can mean "the name is wrong": a refused format and a name already taken. The
 * exact shape is an open [NEEDS CLARIFICATION] on R4 (owner: BE), so the status is the only signal
 * available — which is why it stays this narrow. Every other 4xx is about the customer's rights or the
 * route (401, 403, 404, 429), not about a field, and telling someone their vault name is the problem
 * when they simply lack the order permission moves their focus into a value that is perfectly valid.
 */
const VAULT_NAME_REJECTION_STATUSES: readonly number[] = [400, 409];

/**
 * A rejection the customer can answer by changing the name, as opposed to one about the channel.
 * Everything else — transport, 5xx, another 4xx, an answer with no message — is a channel failure the
 * customer cannot fix by editing a field, and belongs in the modal-level banner.
 */
export const isVaultNameRejection = (error?: TApiCustomError | null): boolean => {
  const status = error?.response?.status;

  return (
    !!getVaultOrderErrorMessage(error) && !!status && VAULT_NAME_REJECTION_STATUSES.includes(status)
  );
};
