import { useTranslation } from 'react-i18next';
import {
  useCatalogPrice,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { useMemo, useState } from 'react';
import { Input, Text } from '@ovhcloud/ods-react';
import { useNavigate } from 'react-router-dom';
import { DefaultError } from '@tanstack/react-query';
import ActionModal from '@/components/actionModal/ActionModal.component';
import { useInstanceBackupAction } from '@/data/hooks/instance/action/useInstanceAction';
import { useInstanceBackupPrice } from '@/data/hooks/instance/action/useInstanceBackupPrice';
import {
  useInstanceActionModal,
  useInstanceParams,
} from '@/pages/instances/action/hooks/useInstanceActionModal';
import { useProjectId } from '@/hooks/project/useProjectId';
import { isApiErrorResponse } from '@/utils';

const BackupActionPage = () => {
  const projectId = useProjectId();
  const { instanceId, region } = useInstanceParams();

  const { t, i18n } = useTranslation('actions');
  const { addError, addInfo } = useNotifications();
  const navigate = useNavigate();

  const { instance, isLoading } = useInstanceActionModal(
    region,
    instanceId,
    'backup',
  );

  const locale = i18n.language.replace('_', '-');
  const defaultSnapshotName = useMemo(
    () =>
      `${instance?.name} ${new Date().toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}`,
    [instance?.name, locale],
  );

  const [snapshotName, setSnapshotName] = useState(defaultSnapshotName);

  const {
    price: backupPrice,
    isLoading: isBackupLoading,
  } = useInstanceBackupPrice(projectId, region);

  const closeModal = () => navigate('..');

  const onError = (rawError: unknown) => {
    const errorMessage = isApiErrorResponse(rawError)
      ? rawError.response?.data.message
      : (rawError as DefaultError).message;
    addError(
      t(`pci_instances_actions_backup_instance_error_message`, {
        name: instance?.name,
        error: errorMessage,
      }),
      true,
    );
  };

  const { mutationHandler, isPending } = useInstanceBackupAction(projectId, {
    onError,
    onSuccess: (_data, variables) => {
      addInfo(
        t(`pci_instances_actions_backup_instance_success_message`, {
          name: variables.snapshotName,
        }),
        true,
      );

      closeModal();
    },
  });

  const handleInstanceAction = () => {
    if (instance) mutationHandler({ instance, snapshotName });
  };

  const { getFormattedCatalogPrice } = useCatalogPrice(3);

  const price = backupPrice ? getFormattedCatalogPrice(backupPrice) : null;
  return (
    <ActionModal
      title={t(`pci_instances_actions_backup_instance_title`)}
      isPending={isPending}
      handleInstanceAction={handleInstanceAction}
      onModalClose={closeModal}
      instance={instance}
      section={'backup'}
      isLoading={isLoading}
    >
      <div className="flex flex-col gap-4">
        <Text>{t('pci_instances_actions_backup_instance_name_label')}</Text>
        <Input
          name="backup-name"
          value={snapshotName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSnapshotName(e.target.value)
          }
          className="min-h-[40px]"
        />
        {!!price && !isBackupLoading && (
          <Text>
            {t('pci_instances_actions_backup_instance_price', {
              price,
            })}
          </Text>
        )}
      </div>
    </ActionModal>
  );
};

export default BackupActionPage;
