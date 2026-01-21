import { FC } from 'react';

import { useHref } from 'react-router-dom';

import { DataGridTextCell, Links } from '@ovh-ux/manager-react-components';

import { urlParams, urls } from '@/routes/routes.constants';

export const VaultIdCell: FC<{ id: string; name: string }> = ({ id, name }) => {
  const href = useHref(urls.dashboardVaults.replace(urlParams.vaultId, id));

  return (
    <DataGridTextCell>
      <Links href={href} label={name} />
    </DataGridTextCell>
  );
};
