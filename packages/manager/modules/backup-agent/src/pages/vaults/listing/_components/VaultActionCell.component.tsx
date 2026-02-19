import { FC } from 'react';

import { useHref } from 'react-router-dom';

import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { ArrowLinkCell } from '@/components/CommonCells/ArrowLinkCell/ArrowLinkCell.component';
import { urlParams, urls } from '@/routes/routes.constants';

export const VaultActionCell: FC<{ id: string }> = ({ id }) => {
  const href = useHref(urls.dashboardVaults.replace(urlParams.vaultId, id));
  const { trackClick } = useOvhTracking();
  return (
    <DataGridTextCell>
      <ArrowLinkCell
        href={href}
        data-testid="arrow-link-cell"
        onClick={() =>
          trackClick({
            location: PageLocation.datagrid,
            buttonType: ButtonType.link,
            actionType: 'navigation',
            actions: ['go-to-vault-dashboard'],
          })
        }
      />
    </DataGridTextCell>
  );
};
