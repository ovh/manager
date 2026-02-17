import { FC } from 'react';

import { useHref } from 'react-router-dom';

import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import { ArrowLink } from '@/components/ArrowLink/ArrowLink.component';
import { urlParams, urls } from '@/routes/routes.constants';

export const VaultActionCell: FC<{ id: string }> = ({ id }) => {
  const href = useHref(urls.dashboardVaults.replace(urlParams.vaultId, id));
  return (
    <DataGridTextCell>
      <ArrowLink href={href} data-testid="arrow-link-cell" />
    </DataGridTextCell>
  );
};
