import React from 'react';

import { useHref } from 'react-router-dom';

import { DataGridTextCell, Links } from '@ovh-ux/manager-react-components';

import { urlParams, urls } from '@/routes/routes.constants';
import { VaultResource } from '@/types/Vault.type';

export const VaultIdCell = (vaultResource: VaultResource) => {
  const dashboardLink = useHref(urls.dashboardVaults.replace(urlParams.vaultId, vaultResource.id));

  return (
    <DataGridTextCell>
      <Links href={dashboardLink} label={vaultResource.currentState.name} />
    </DataGridTextCell>
  );
};
