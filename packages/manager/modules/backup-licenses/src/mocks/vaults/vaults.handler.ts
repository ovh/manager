import { PathParams } from 'msw';

import { Handler } from '@ovh-ux/manager-core-test-utils';

import { mockVaultBucketCredentials, mockVaults } from '@/mocks/vaults/vaults.mock';
import { VaultResource } from '@/types/Vault.type';

export type TVaultMockParams = {
  vaults?: VaultResource[];
  isVaultListError?: boolean;
  isVaultCredentialsError?: boolean;
  /** Holds the credentials answer back, so the in-modal loading state can be observed. */
  vaultCredentialsDelay?: number;
  /**
   * Number of list calls a CREATING vault stays CREATING before flipping to READY. A static fixture
   * cannot prove that polling stops, so the handler has to change its answer over time.
   * `Infinity` keeps it CREATING forever, which is how the timeout path gets tested.
   */
  vaultCreatingCallsBeforeReady?: number;
};

const settleCreatingVaults = (vaults: VaultResource[]): VaultResource[] =>
  vaults.map((vault) =>
    vault.currentState.status === 'CREATING'
      ? {
          ...vault,
          resourceStatus: 'READY',
          currentTasks: [],
          currentState: { ...vault.currentState, status: 'READY' },
        }
      : vault,
  );

export const getVaultMocks = ({
  vaults,
  isVaultListError,
  isVaultCredentialsError,
  vaultCredentialsDelay = 0,
  vaultCreatingCallsBeforeReady,
}: TVaultMockParams): Handler[] => {
  let listCalls = 0;

  return [
    {
      url: '/backupServices/tenant/:backupServicesId/vault',
      response: () => {
        if (isVaultListError) return { message: 'Internal server error' };

        listCalls += 1;
        const list = vaults ?? mockVaults;

        return vaultCreatingCallsBeforeReady !== undefined &&
          listCalls > vaultCreatingCallsBeforeReady
          ? settleCreatingVaults(list)
          : list;
      },
      api: 'v2',
      method: 'get',
      status: isVaultListError ? 500 : 200,
      delay: 0,
    },
    {
      url: '/backupServices/tenant/:backupServicesId/vault/:vaultId',
      response: (_: unknown, params: PathParams) =>
        (vaults ?? mockVaults).find(({ id }) => id === params.vaultId),
      api: 'v2',
      method: 'get',
      status: 200,
      delay: 0,
    },
    {
      url: '/backupServices/tenant/:backupServicesId/vault/:vaultId/bucket/:bucketId/credentials',
      response: () =>
        isVaultCredentialsError ? { message: 'Internal server error' } : mockVaultBucketCredentials,
      api: 'v2',
      method: 'get',
      status: isVaultCredentialsError ? 500 : 200,
      delay: vaultCredentialsDelay,
    },
  ];
};
