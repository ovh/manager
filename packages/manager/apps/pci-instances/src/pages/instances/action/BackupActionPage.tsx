import ActionModal from '@/components/actionModal/ActionModal.component';
import { TCustomModalActionPage } from './RescueAction.page';

type TBackupActionPageProps = Omit<TCustomModalActionPage, 'section'> & {
  section: 'backup';
};

const BackupActionPage = ({
  title,
  handleModalClose,
  section,
  instance,
}: TBackupActionPageProps) => {
  const isPending = false;
  const handleInstanceAction = () => {};
  return (
    <ActionModal
      title={title}
      isPending={isPending}
      handleInstanceAction={handleInstanceAction}
      handleModalClose={handleModalClose}
      instanceName={instance.name}
      section={section}
    >
      <div>
        <input type="text" name="backup-name" />
      </div>
    </ActionModal>
  );
};

export default BackupActionPage;
