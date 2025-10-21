import React from 'react';

import {VaultResource} from "@/types/Vault.type";

import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import {VaultStatusBadge} from "@/components/VaultStatusBadge/VaultStatusBadge.components";



export const VaultStatusCell = (vaultResource: VaultResource) => {
  return (
    <DataGridTextCell>
      <VaultStatusBadge vaultStatus={vaultResource.resourceStatus} />
    </DataGridTextCell>
  );
};
