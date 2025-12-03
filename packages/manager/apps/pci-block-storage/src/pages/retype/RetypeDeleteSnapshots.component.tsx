import { Trans, useTranslation } from 'react-i18next';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Link } from '@ovhcloud/ods-react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useProjectUrl } from '@ovh-ux/manager-react-components';
import { useDeleteVolumeSnapshots } from '@/api/hooks/useSnapshot';
import { RetypeConfirmActionForm } from '@/pages/retype/RetypeConfirmActionForm.component';

type RetypeDeleteSnapshotsProps = {
  projectId: string;
  volumeId: string;
};

export const RetypeDeleteSnapshots: FC<RetypeDeleteSnapshotsProps> = ({
  projectId,
  volumeId,
}) => {
  const { t } = useTranslation(['retype', NAMESPACES.ACTIONS, NAMESPACES.FORM]);
  const navigate = useNavigate();
  const projectUrl = useProjectUrl('public-cloud');
  const hrefCreateBackup = `${projectUrl}/storages/volume-snapshots`;

  const {
    deleteVolumeSnapshots,
    isPending: isDeleteSnapshotsPending,
    isError: isDeleteSnapshotsError,
  } = useDeleteVolumeSnapshots({
    projectId,
    volumeId,
  });

  const handleOnClose = () => {
    navigate('..');
  };

  const handleOnSubmit = () => deleteVolumeSnapshots();

  return (
    <RetypeConfirmActionForm
      label={t(
        'pci_projects_project_storages_blocks_retype_delete_snapshots_label',
      )}
      warningMessage={t(
        'retype:pci_projects_project_storages_blocks_retype_delete_snapshots_warning',
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
