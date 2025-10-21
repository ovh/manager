import React from 'react';

import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import { VaultResource } from '@/types/Vault.type';

export const VaultBucketsCell = (vaultResource: VaultResource) => (
  <DataGridTextCell>{vaultResource.currentState.vspc.length}</DataGridTextCell>
);
