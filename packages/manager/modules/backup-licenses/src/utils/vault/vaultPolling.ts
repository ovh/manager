import { VaultResource } from '@/types/Vault.type';

/** Slice 2.5 (BKP-1220) owns these two figures; R11 reuses them rather than restating them. */
export const VAULT_POLLING_INTERVAL_MS = 10_000;
export const VAULT_POLLING_TIMEOUT_MS = 5 * 60_000;

/**
 * Provisioning, not merely unsettled: an ERROR or SUSPENDED vault never becomes READY, so reading
 * this off `selectIsVaultSettled` would poll a broken vault until the ceiling.
 */
export const isVaultProvisioning = (vault: VaultResource): boolean =>
  vault.resourceStatus === 'CREATING' || !!vault.currentTasks?.length;

/** Narrower than TanStack's `Query`, which satisfies it — the rule stays callable without a cache. */
export type VaultsPollingQuery = {
  state: { data?: VaultResource[] };
};

/**
 * `'settled'` and `'timed-out'` both stop the polling and mean opposite things to the customer: the
 * second is a vault still being created that nothing follows any more, which R11 answers with a message
 * inviting a refresh. Reporting both as `false` left that ceiling unobservable.
 */
export type VaultsPollingState = 'settled' | 'polling' | 'timed-out';

/**
 * When each provisioning vault's episode must stop. Held outside the cache because no query state
 * records when provisioning *started* — `dataUpdateCount` counts every read of the list for the whole
 * life of the cache entry, so counting reads spends the second order's five minutes on the first.
 *
 * Keyed by vault, not by query, because an expired episode is deliberately kept: keyed by query, one
 * vault stuck in creation would hold the whole list past its ceiling and nothing ordered afterwards
 * would ever be polled.
 */
const vaultDeadlines = new Map<string, number>();

/** The table outlives a query instance, so a test that opens an episode has to be able to drop it. */
export const resetVaultPollingDeadlines = (): void => vaultDeadlines.clear();

const provisioningVaults = (vaults: readonly VaultResource[] = []): VaultResource[] =>
  vaults.filter(isVaultProvisioning);

/**
 * Reads the running episodes without opening one, so a render can ask "has the ceiling passed" without
 * changing the answer. A vault no episode has been opened for yet counts as followed: its five minutes
 * start on the next evaluation of the refetch rule, not here.
 */
export const getVaultsPollingState = (
  vaults: readonly VaultResource[] | undefined,
  now: number = Date.now(),
): VaultsPollingState => {
  const provisioning = provisioningVaults(vaults);

  if (!provisioning.length) {
    return 'settled';
  }

  const isFollowed = ({ id }: VaultResource) => {
    const deadline = vaultDeadlines.get(id);
    return deadline === undefined || now < deadline;
  };

  return provisioning.some(isFollowed) ? 'polling' : 'timed-out';
};

/**
 * Opens an episode for every vault that has just started provisioning and closes the one of every
 * vault that no longer is — so a vault ordered later is followed for a full five minutes even while an
 * earlier one sits in creation past its own ceiling.
 *
 * The list keeps being re-read while at least one episode is live, so the refetch that crosses the
 * last deadline is also what re-renders the consumers — which is how `getVaultsPollingState` gets the
 * chance to report `'timed-out'` once polling has stopped.
 */
export const getVaultsRefetchInterval = (
  { state }: VaultsPollingQuery,
  now: number = Date.now(),
): number | false => {
  // A list that has not loaded is not a list where nothing is provisioning: reconciling on it would
  // close the episodes of the vaults it is about to return.
  if (!state.data) {
    return false;
  }

  const provisioning = provisioningVaults(state.data);
  const provisioningIds = new Set(provisioning.map(({ id }) => id));

  [...vaultDeadlines.keys()]
    .filter((vaultId) => !provisioningIds.has(vaultId))
    .forEach((vaultId) => vaultDeadlines.delete(vaultId));

  provisioning
    .filter(({ id }) => !vaultDeadlines.has(id))
    .forEach(({ id }) => vaultDeadlines.set(id, now + VAULT_POLLING_TIMEOUT_MS));

  return getVaultsPollingState(provisioning, now) === 'polling' ? VAULT_POLLING_INTERVAL_MS : false;
};
