import React from 'react';

import { useHref } from 'react-router-dom';

import { DataGridTextCell, Links } from '@ovh-ux/manager-react-components';

import { urlParams, urls } from '@/routes/routes.constants';
import { VaultResource } from '@/types/Vault.type';

export type VaultNameCellProps = Pick<VaultResource, 'id'> &
  Pick<VaultResource['currentState'], 'name'>;

export const BillingNameCell = ({ id, name }: VaultNameCellProps) => {
  const dashboardLink = useHref(urls.dashboardVaults.replace(urlParams.vaultId, id));

  return (
    <DataGridTextCell>
      <Links href={dashboardLink} label={name} />
    </DataGridTextCell>
  );
};
