import { Trans, useTranslation } from 'react-i18next';
import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Link } from '@ovhcloud/ods-react';
import { useForm } from 'react-hook-form';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useProjectUrl } from '@ovh-ux/manager-react-components';
import { TVolumeSnapshot } from '@/api/data/snapshot';
import { useDeleteVolumeSnapshots } from '@/api/hooks/useSnapshot';
import { RetypeConfirmActionForm } from '@/pages/retype/RetypeConfirmActionForm.component';

type RetypeDeleteSnapshotsProps = {
  snapshots: TVolumeSnapshot[];
  projectId: string;
  volumeId: string;
};

export const RetypeDeleteSnapshots: FC<RetypeDeleteSnapshotsProps> = ({
  snapshots,
  projectId,
  volumeId,
}) => {
  const { t } = useTranslation(['retype', NAMESPACES.ACTIONS, NAMESPACES.FORM]);
  const navigate = useNavigate();
  const projectUrl = useProjectUrl('public-cloud');
  const hrefCreateBackup = `${projectUrl}/storages/volume-snapshots`;

  const snapshotsIds = useMemo(() => snapshots.map((snap) => snap.id), [
    snapshots,
  ]);

  const {
    deleteVolumeSnapshots,
    isPending: isDeleteSnapshotsPending,
    isError: isDeleteSnapshotsError,
  } = useDeleteVolumeSnapshots({
    projectId,
    volumeId,
    snapshotsIds,
  });

  const handleOnClose = () => {
    navigate('..');
  };

  const handleOnSubmit = () => deleteVolumeSnapshots();

  return (
    <RetypeConfirmActionForm
      warningMessage={t(
        'retype:pci_projects_project_storages_blocks_retype_delete_snapshots',
      )}
      confirmWord="DELETE"
      errorElement={
        <Trans
          i18nKey="pci_projects_project_storages_blocks_retype_delete_snapshots_error"
          ns="retype"
          components={[
            <Link
              key="0"
              color={ODS_THEME_COLOR_INTENT.primary}
              href={hrefCreateBackup}
              className="inline"
            />,
          ]}
        />
      }
      onSubmit={handleOnSubmit}
      onClose={handleOnClose}
      isPending={isDeleteSnapshotsPending}
      isError={isDeleteSnapshotsError}
    />
  );
};
