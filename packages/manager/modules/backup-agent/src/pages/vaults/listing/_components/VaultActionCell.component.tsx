import { useId } from 'react';

import { useNavigate } from 'react-router-dom';

import { DataGridTextCell, ManagerButton } from '@ovh-ux/manager-react-components';

import { BACKUP_AGENT_IAM_RULES } from '@/module.constants';
import { subRoutes } from '@/routes/routes.constants';
import { VaultResource } from '@/types/Vault.type';
import { buildSearchQuery } from '@/utils/buildSearchQuery.utils';

export const VaultActionCell = (vaultResource: VaultResource) => {
  const navigate = useNavigate();
  const buttonId = useId();

  const queryParams = buildSearchQuery({ vaultId: vaultResource.id });

  return (
    <DataGridTextCell>
      <ManagerButton
        id={buttonId}
        label=""
        icon="trash"
        variant="ghost"
        data-testid="delete-vault-button"
        iamActions={[BACKUP_AGENT_IAM_RULES['vault/edit']]}
        onClick={() => {
          navigate(`${subRoutes.delete}${queryParams}`);
        }}
      />
    </DataGridTextCell>
  );
};
