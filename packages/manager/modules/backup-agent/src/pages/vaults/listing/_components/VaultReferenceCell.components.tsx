import React from 'react';

import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import { VaultResource } from '@/types/Vault.type';

export const VaultReferenceCell = (vaultResource: VaultResource) => (
  <DataGridTextCell>{vaultResource.currentState.resourceName}</DataGridTextCell>
);
