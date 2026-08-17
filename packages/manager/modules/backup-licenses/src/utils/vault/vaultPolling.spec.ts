import { beforeEach, describe, expect, it } from 'vitest';

import { mockEdgeCaseVaults, mockVaults, mockVaultsFromDesign } from '@/mocks/vaults/vaults.mock';
import { VaultResource } from '@/types/Vault.type';

import {
  VAULT_POLLING_INTERVAL_MS,
  VAULT_POLLING_TIMEOUT_MS,
  getVaultsPollingState,
  getVaultsRefetchInterval,
  isVaultProvisioning,
  resetVaultPollingDeadlines,
} from './vaultPolling';

const vaultNamed = (name: string): VaultResource =>
  [...mockVaults, ...mockEdgeCaseVaults].find(
    ({ currentState }) => currentState.name === name,
  ) as VaultResource;

const [, readyVault] = mockVaultsFromDesign as [VaultResource, VaultResource];

// Les trois lignes de la maquette sont toutes READY : le vault en création vient des cas limites.
const creatingVault = mockEdgeCaseVaults.find(
  ({ id }) => id === 'vault-status-creating',
) as VaultResource;

const settled = (vault: VaultResource): VaultResource => ({
  ...vault,
  resourceStatus: 'READY',
  currentTasks: [],
});

const provisioningVault = (id: string): VaultResource => ({
  ...creatingVault,
  id,
  currentState: { ...creatingVault.currentState, id, name: `vault-paygo-${id}` },
});

describe('isVaultProvisioning', () => {
  it('follows a vault the API reports as creating', () => {
    expect(isVaultProvisioning(creatingVault)).toBe(true);
  });

  it('stops following it once it is ready with no task left', () => {
    expect(isVaultProvisioning(settled(creatingVault))).toBe(false);
    expect(isVaultProvisioning(readyVault)).toBe(false);
  });

  it('follows a vault whose task is still running, whatever its status reads', () => {
    expect(
      isVaultProvisioning({
        ...readyVault,
        currentTasks: [{ id: 'task-1', link: '', status: 'RUNNING', type: 'vault/update' }],
      }),
    ).toBe(true);
  });

  it('leaves a failed or suspended vault alone, because it will never turn ready', () => {
    expect(isVaultProvisioning(vaultNamed('vault-status-error'))).toBe(false);
    expect(isVaultProvisioning(vaultNamed('vault-status-suspended'))).toBe(false);
  });

  it('treats a missing task list as no task, since the field is optional on the envelope', () => {
    expect(isVaultProvisioning({ ...readyVault, currentTasks: undefined })).toBe(false);
  });
});

describe('getVaultsRefetchInterval', () => {
  const START = 1_700_000_000_000;

  const provisioning = { state: { data: [...mockVaultsFromDesign, creatingVault] } };
  const settledList = { state: { data: mockVaultsFromDesign.map(settled) } };

  beforeEach(resetVaultPollingDeadlines);

  it('polls every ten seconds while a vault is being created', () => {
    expect(getVaultsRefetchInterval(provisioning, START)).toBe(VAULT_POLLING_INTERVAL_MS);
  });

  it('stops as soon as the vault has settled', () => {
    expect(getVaultsRefetchInterval(settledList, START)).toBe(false);
  });

  it('does not poll a list that has not loaded yet', () => {
    expect(getVaultsRefetchInterval({ state: {} }, START)).toBe(false);
  });

  it('does not end a running episode because a consumer mounted before the list resolved', () => {
    getVaultsRefetchInterval(provisioning, START);
    getVaultsRefetchInterval({ state: {} }, START + 60_000);

    expect(getVaultsRefetchInterval(provisioning, START + VAULT_POLLING_TIMEOUT_MS)).toBe(false);
  });

  it('gives up on a vault stuck in creation once the five minutes are spent', () => {
    getVaultsRefetchInterval(provisioning, START);

    expect(getVaultsRefetchInterval(provisioning, START + VAULT_POLLING_TIMEOUT_MS - 1)).toBe(
      VAULT_POLLING_INTERVAL_MS,
    );
    expect(getVaultsRefetchInterval(provisioning, START + VAULT_POLLING_TIMEOUT_MS)).toBe(false);
  });

  it('measures the five minutes from the moment provisioning appeared, not from the first read', () => {
    // Forty reads a long session takes for other reasons — mounts, window-focus refetches, the
    // invalidation an order fires — none of which may be charged to the episode that follows.
    for (let read = 0; read < 40; read += 1) {
      getVaultsRefetchInterval(settledList, START + read * 60_000);
    }
    const orderedAt = START + 40 * 60_000;

    expect(getVaultsRefetchInterval(provisioning, orderedAt)).toBe(VAULT_POLLING_INTERVAL_MS);
    expect(getVaultsRefetchInterval(provisioning, orderedAt + VAULT_POLLING_TIMEOUT_MS - 1)).toBe(
      VAULT_POLLING_INTERVAL_MS,
    );
  });

  it('gives the next order its own five minutes, once the previous one has settled', () => {
    const firstOrder = getVaultsRefetchInterval(provisioning, START);
    getVaultsRefetchInterval(provisioning, START + 2 * 60_000);
    getVaultsRefetchInterval(settledList, START + 3 * 60_000);
    const secondOrderAt = START + 4 * 60_000;

    expect(firstOrder).toBe(VAULT_POLLING_INTERVAL_MS);
    expect(getVaultsRefetchInterval(provisioning, secondOrderAt)).toBe(VAULT_POLLING_INTERVAL_MS);
    expect(
      getVaultsRefetchInterval(provisioning, secondOrderAt + VAULT_POLLING_TIMEOUT_MS - 1),
    ).toBe(VAULT_POLLING_INTERVAL_MS);
    expect(getVaultsRefetchInterval(provisioning, secondOrderAt + VAULT_POLLING_TIMEOUT_MS)).toBe(
      false,
    );
  });

  it('follows a vault by its id, so the same one read through two queries shares one episode', () => {
    const sameVaultsAnotherQuery = { state: { data: [...mockVaultsFromDesign] } };

    getVaultsRefetchInterval(provisioning, START);

    expect(getVaultsRefetchInterval(sameVaultsAnotherQuery, START + VAULT_POLLING_TIMEOUT_MS)).toBe(
      false,
    );
  });

  it('gives a vault ordered while an earlier one is stuck in creation its own five minutes', () => {
    const stuck = { state: { data: [creatingVault] } };
    const stuckAndNewOrder = { state: { data: [creatingVault, provisioningVault('0004')] } };
    const secondOrderAt = START + 10 * 60_000;

    getVaultsRefetchInterval(stuck, START);
    expect(getVaultsRefetchInterval(stuck, START + VAULT_POLLING_TIMEOUT_MS)).toBe(false);

    expect(getVaultsRefetchInterval(stuckAndNewOrder, secondOrderAt)).toBe(
      VAULT_POLLING_INTERVAL_MS,
    );
    expect(
      getVaultsRefetchInterval(stuckAndNewOrder, secondOrderAt + VAULT_POLLING_TIMEOUT_MS - 1),
    ).toBe(VAULT_POLLING_INTERVAL_MS);
    expect(
      getVaultsRefetchInterval(stuckAndNewOrder, secondOrderAt + VAULT_POLLING_TIMEOUT_MS),
    ).toBe(false);
  });

  it('reads the clock itself when no caller supplies one', () => {
    expect(getVaultsRefetchInterval(provisioning)).toBe(VAULT_POLLING_INTERVAL_MS);
  });
});

describe('getVaultsPollingState', () => {
  const START = 1_700_000_000_000;
  const creatingList = [creatingVault];

  beforeEach(resetVaultPollingDeadlines);

  it('is settled on a list where nothing is provisioning, and on one that has not loaded', () => {
    expect(getVaultsPollingState(mockVaultsFromDesign.map(settled), START)).toBe('settled');
    expect(getVaultsPollingState([], START)).toBe('settled');
    expect(getVaultsPollingState(undefined, START)).toBe('settled');
  });

  it('is settled on the status edge cases, none of which is a vault being provisioned', () => {
    // CREATING est exclu : c'est le seul statut que le polling doit justement suivre.
    const stuckStatuses = mockEdgeCaseVaults.filter(
      ({ resourceStatus, currentState }) =>
        currentState.name.startsWith('vault-status-') && resourceStatus !== 'CREATING',
    );

    expect(stuckStatuses.length).toBeGreaterThan(0);
    expect(getVaultsPollingState(stuckStatuses, START)).toBe('settled');
  });

  it('is polling for a vault whose episode the refetch rule has not opened yet', () => {
    expect(getVaultsPollingState(creatingList, START)).toBe('polling');
  });

  it('is polling until the last second of the episode', () => {
    getVaultsRefetchInterval({ state: { data: creatingList } }, START);

    expect(getVaultsPollingState(creatingList, START + VAULT_POLLING_TIMEOUT_MS - 1)).toBe(
      'polling',
    );
  });

  it('reports the ceiling R11 asks a message for, instead of reporting a settled list', () => {
    getVaultsRefetchInterval({ state: { data: creatingList } }, START);

    expect(getVaultsPollingState(creatingList, START + VAULT_POLLING_TIMEOUT_MS)).toBe('timed-out');
  });

  it('leaves the ceiling as soon as a newly ordered vault is being followed again', () => {
    const stuckAndNewOrder = [creatingVault, provisioningVault('0004')];
    const secondOrderAt = START + 10 * 60_000;

    getVaultsRefetchInterval({ state: { data: creatingList } }, START);
    getVaultsRefetchInterval({ state: { data: stuckAndNewOrder } }, secondOrderAt);

    expect(getVaultsPollingState(stuckAndNewOrder, secondOrderAt)).toBe('polling');
  });

  it('opens no episode of its own, so rendering the state cannot start the clock', () => {
    const query = { state: { data: creatingList } };

    for (let render = 0; render < 40; render += 1) {
      getVaultsPollingState(creatingList, START + render * 60_000);
    }
    const firstPoll = START + 40 * 60_000;

    expect(getVaultsRefetchInterval(query, firstPoll)).toBe(VAULT_POLLING_INTERVAL_MS);
    expect(getVaultsRefetchInterval(query, firstPoll + VAULT_POLLING_TIMEOUT_MS - 1)).toBe(
      VAULT_POLLING_INTERVAL_MS,
    );
  });
});
