import { Handler } from '@ovh-ux/manager-core-test-utils';

import { mockVaults } from '@/mocks/vault/vaults';
import { VaultResource } from '@/types/Vault.type';

export type TVaultMockParams = {
  vault?: VaultResource[];
};

export const getVaultMocks = ({ vault }: TVaultMockParams): Handler[] => [
  {
    url: '/backup/tenant/vault',
    response: () => vault ?? mockVaults,
    api: 'v2',
    method: 'get',
    status: 200,
  },
];
