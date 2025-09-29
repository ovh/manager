import React from 'react';

import { DataGridTextCell, Links } from '@ovh-ux/manager-react-components';

import { VaultResource } from '@/types/Vault.type';

export const VaultIdCell = (vaultResource: VaultResource) => {
  return (
    <DataGridTextCell>
      <Links href="/#/" label={vaultResource.currentState.name} />
    </DataGridTextCell>
  );
};
