import React from 'react';

import { DataGridTextCell, Links } from '@ovh-ux/manager-react-components';

import { VaultResource } from '@/types/Vault.type';
import { useHref } from "react-router-dom";
import {urlParams, urls} from "../../../routes/Routes.constants";

export const VaultIdCell = (vaultResource: VaultResource) => {
  const dashboardLink = useHref(urls.dashboard.replace(urlParams.vaultId, vaultResource.id))

  return (
    <DataGridTextCell>
      <Links href={dashboardLink} label={vaultResource.currentState.name} />
    </DataGridTextCell>
  );
};
