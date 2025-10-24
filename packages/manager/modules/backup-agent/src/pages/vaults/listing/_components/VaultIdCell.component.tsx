import { useHref } from 'react-router-dom';

import { DataGridTextCell, Links } from '@ovh-ux/manager-react-components';

import { urlParams, urls } from '@/routes/Routes.constants';
import { VaultResource } from '@/types/Vault.type';

export const VaultIdCell = (vaultResource: VaultResource) => {
  const dashboardLink = useHref(urls.dashboard.replace(urlParams.vaultId, vaultResource.id));

  return (
    <DataGridTextCell>
      <Links href={dashboardLink} label={vaultResource.currentState.name} />
    </DataGridTextCell>
  );
};
