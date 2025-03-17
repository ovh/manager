import { useTranslation } from 'react-i18next';
import { Input } from '@datatr-ux/uxlib';
import { useMemo, useState } from 'react';
import ActionModal from '@/components/actionModal/ActionModal.component';
import { TCustomModalActionPage } from './RescueAction.page';
import { useInstanceBackupAction } from '@/data/hooks/instance/action/useInstanceAction';
import { useInstanceBackupPrice } from '@/data/hooks/instance/action/useInstanceBackupPrice';

type TBackupActionPageProps = Omit<TCustomModalActionPage, 'section'> & {
  section: 'backup';
};

const BackupActionPage = ({
  title,
  handleModalClose,
  section,
  instance,
  projectId,
  handleMutationError,
  handleMutationSuccess,
}: TBackupActionPageProps) => {
  const { t, i18n } = useTranslation('actions');
  const locale = i18n?.language?.replace('_', '-');
  const defaultSnapshotName = useMemo(
    () =>
      `${instance.name} ${new Date().toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}`,
    [instance.name, locale],
  );

  const [snapshotName, setSnapshotName] = useState(defaultSnapshotName);

  const { price, isLoading } = useInstanceBackupPrice(
    projectId,
    instance.region,
  );

  const { mutationHandler, isPending } = useInstanceBackupAction(projectId, {
    onError: handleMutationError,
    onSuccess: handleMutationSuccess,
  });

  const handleInstanceAction = () =>
    mutationHandler({ instance, snapshotName });

  return (
    <ActionModal
      title={title}
      isPending={isPending}
      handleInstanceAction={handleInstanceAction}
      handleModalClose={handleModalClose}
      instanceName={instance.name}
      section={section}
    >
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">
          {t('pci_instances_actions_backup_instance_name_label')}
        </p>
        <Input
          type="text"
          name="backup-name"
          value={snapshotName}
          onChange={(e) => setSnapshotName(e.target.value)}
        />
        {price && !isLoading ? (
          <p className="text-sm font-medium">
            {t('pci_instances_actions_backup_instance_price', {
              price,
            })}
          </p>
        ) : (
          <></>
        )}
      </div>
    </ActionModal>
  );
};

export default BackupActionPage;
