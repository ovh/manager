import { useId } from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { OdsButton, OdsText, OdsTooltip } from '@ovhcloud/ods-components/react';

import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { subRoutes } from '@/routes/Routes.constants';
import { VaultResource } from '@/types/Vault.type';
import { buildSearchQuery } from '@/utils/buildSearchQuery.utils';

export const VaultActionCell = (vaultResource: VaultResource) => {
  const { t } = useTranslation(BACKUP_AGENT_NAMESPACES.VAULT_DELETE);
  const navigate = useNavigate();
  const buttonId = useId();

  const queryParams = buildSearchQuery({ vaultId: vaultResource.id });
  const isDeleteDisable = !!vaultResource.currentState.vspc.length;

  return (
    <DataGridTextCell>
      {isDeleteDisable && (
        <OdsTooltip triggerId={buttonId}>
          <OdsText>{t('delete_vault_disabled_tooltip')}</OdsText>
        </OdsTooltip>
      )}
      <OdsButton
        id={buttonId}
        label=""
        icon="trash"
        variant="ghost"
        isDisabled={isDeleteDisable}
        data-testid="delete-vault-button"
        onClick={() => {
          if (isDeleteDisable) return;
          navigate(`${subRoutes.delete}${queryParams}`);
        }}
      />
    </DataGridTextCell>
  );
};
