import { useId } from 'react';

import { useNavigate } from 'react-router-dom';

import { OdsButton } from '@ovhcloud/ods-components/react';

import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import { subRoutes } from '@/routes/Routes.constants';
import { VaultResource } from '@/types/Vault.type';
import { buildSearchQuery } from '@/utils/buildSearchQuery.utils';

export const VaultActionCell = (vaultResource: VaultResource) => {
  const navigate = useNavigate();
  const buttonId = useId();

  const queryParams = buildSearchQuery({ vaultId: vaultResource.id });

  return (
    <DataGridTextCell>
      <OdsButton
        id={buttonId}
        label=""
        icon="trash"
        variant="ghost"
        data-testid="delete-vault-button"
        onClick={() => {
          navigate(`${subRoutes.delete}${queryParams}`);
        }}
      />
    </DataGridTextCell>
  );
};
