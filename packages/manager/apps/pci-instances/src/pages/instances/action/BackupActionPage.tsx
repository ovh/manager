import { useTranslation } from 'react-i18next';
import { useCatalogPrice } from '@ovh-ux/manager-react-components';
import { Input } from '@datatr-ux/uxlib';
import { useMemo, useState } from 'react';
import ActionModal from '@/components/actionModal/ActionModal.component';
import { TRescueActionPageProps } from './RescueAction.page';
import { useInstanceBackupAction } from '@/data/hooks/instance/action/useInstanceAction';
import { useInstanceBackupPrice } from '@/data/hooks/instance/action/useInstanceBackupPrice';

type TBackupActionPageProps = Omit<TRescueActionPageProps, 'section'> & {
  section: 'backup';
};

const BackupActionPage = ({
  title,
  onModalClose,
  section,
  instance,
  projectId,
  onError,
  onSuccess,
  isLoading,
}: TBackupActionPageProps) => {
  const { t, i18n } = useTranslation('actions');
  const locale = i18n?.language?.replace('_', '-');
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

  const { price, isLoading: isBackupLoading } = useInstanceBackupPrice(
    projectId,
    instance?.region ?? '',
  );

  const { mutationHandler, isPending } = useInstanceBackupAction(projectId, {
    onError,
    onSuccess,
  });

  const handleInstanceAction = () => {
    if (instance) mutationHandler({ instance, snapshotName });
  };

  const { getFormattedCatalogPrice } = useCatalogPrice(3);

  return (
    <ActionModal
      title={title}
      isPending={isPending}
      handleInstanceAction={handleInstanceAction}
      onModalClose={onModalClose}
      instance={instance}
      section={section}
      isLoading={isLoading}
    >
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">
          {t('pci_instances_actions_backup_instance_name_label')}
        </p>
        <Input
          type="text"
          name="backup-name"
          value={snapshotName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSnapshotName(e.target.value)
          }
        />
        {!!price && !isBackupLoading && (
          <p className="text-sm font-medium">
            {t('pci_instances_actions_backup_instance_price', {
              price: getFormattedCatalogPrice(Number(price)),
            })}
          </p>
        )}
      </div>
    </ActionModal>
  );
};

export default BackupActionPage;
