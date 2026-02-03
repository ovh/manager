import { PathParams } from 'msw';

import { Handler } from '@ovh-ux/manager-core-test-utils';

import { mockVaults } from '@/mocks/vaults/vaults.mock';
import { VaultResource } from '@/types/Vault.type';

export type TVaultMockParams = {
  vault?: VaultResource[];
  isVaultError?: boolean;
};

export const getVaultMocks = ({ vault, isVaultError }: TVaultMockParams): Handler[] => [
  {
    url: '/backupServices/tenant/:backupServicesId/vault',
    response: () => vault ?? mockVaults,
    api: 'v2',
    method: 'get',
    status: 200,
    delay: 0,
  },
  {
    url: '/backupServices/tenant/:backupServicesId/vault/:vaultId',
    response: (_: unknown, params: PathParams) => {
      if (isVaultError) return null;
      return mockVaults.find((vault) => vault.id === params.vaultId);
    },
    api: 'v2',
    method: 'get',
    status: isVaultError ? 500 : 200,
    delay: 0,
  },
];
