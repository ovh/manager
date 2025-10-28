import { useNavigate, useSearchParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { OdsMessage, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { useBackupVaultsList } from '@/data/hooks/vaults/getVault';
import { useDeleteVault } from '@/data/hooks/vaults/useDeleteVault';

export default function DeleteVaultPage() {
  const { t } = useTranslation([BACKUP_AGENT_NAMESPACES.VAULT_DELETE, NAMESPACES.ACTIONS]);
  const navigate = useNavigate();
  const closeModal = () => navigate('..');
  const { addSuccess, addError } = useNotifications();
  const [searchParams] = useSearchParams();
  const { flattenData: vaults } = useBackupVaultsList();

  const vaultId = searchParams.get('vaultId');
  const vaultName = vaults?.find(({ id }) => id === vaultId)?.currentState.resourceName;

  const { mutate: deleteVault, isPending } = useDeleteVault({
    onSuccess: () => addSuccess(t('delete_vault_banner_success', { vaultName })),
    onError: () => addError(t('delete_vault_banner_error')),
    onSettled: () => closeModal(),
  });

  return (
    <Modal
      isOpen
      heading={t('delete_vault_modal_title')}
      primaryLabel={t(`${NAMESPACES.ACTIONS}:confirm`)}
      onPrimaryButtonClick={() => vaultId && deleteVault(vaultId)}
      isPrimaryButtonLoading={isPending}
      isPrimaryButtonDisabled={isPending}
      secondaryLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      onSecondaryButtonClick={closeModal}
      onDismiss={closeModal}
      type={ODS_MODAL_COLOR.critical}
    >
      <div className="flex flex-col gap-2">
        <OdsText>{t('delete_vault_modal_content', { vaultName })}</OdsText>
        <OdsMessage color="warning" isDismissible={false}>
          {t('delete_vault_modal_warning')}
        </OdsMessage>
      </div>
    </Modal>
  );
}
