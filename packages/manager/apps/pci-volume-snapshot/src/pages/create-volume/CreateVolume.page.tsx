import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BaseLayout,
  RedirectionGuard,
  useNotifications,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
  OdsSpinner,
} from '@ovhcloud/ods-components/react';
import { useParams, useHref, useNavigate } from 'react-router-dom';
import { useProject } from '@ovh-ux/manager-pci-common';
import PciStorageVolumeEdit from './PciStorageVolumeEdit.component';
import { TVolume, TVolumeSnapshot } from '@/api/api.types';
import { useVolumeSnapshots } from '@/api/hooks/useSnapshots';
import { useCreateVolume } from '@/api/hooks/useVolume';
import { NewVolumeData } from '@/api/data/volume';

export default function CreateVolumePage() {
  const { t } = useTranslation(['create-volume', 'volumes']);
  const { addError, addSuccess } = useNotifications();
  const navigate = useNavigate();
  const { projectId, snapshotId } = useParams();
  const hrefProject = useProjectUrl('public-cloud');
  const { data: project } = useProject();
  const hrefListing = useHref('./../..');
  const goBack = () => navigate('./../..');

  const { data: allSnapshots } = useVolumeSnapshots(
    projectId || 'NO_PROJECT_ID',
  );
  const snapshot: TVolumeSnapshot | null = useMemo(
    () => allSnapshots.find((d) => d.id === snapshotId) || null,
    [allSnapshots, snapshotId],
  );

  const { createVolume } = useCreateVolume({
    projectId: projectId || '',
    onSuccess: (newVolume: TVolume) => {
      goBack();
      addSuccess(
        t(
          'pci_projects_project_storages_snapshots_snapshot_create-volume_success_message',
          { volume: newVolume.name },
        ),
      );
    },
    onError: (err: Error, newVolumeData: NewVolumeData) => {
      goBack();
      addError(
        t(
          'pci_projects_project_storages_snapshots_snapshot_create-volume_error_post',
          { volume: newVolumeData.name, message: err },
        ),
      );
    },
  });

  if (!snapshot) {
    return <OdsSpinner />;
  }

  const handleSubmit = (editedVolume: Partial<TVolume>) => {
    createVolume({
      snapshotId: snapshot.id,
      name: editedVolume.name,
      region: snapshot.region,
      size: editedVolume.size,
      type: snapshot.volume?.type,
      bootable: snapshot.volume?.bootable,
    });
  };

  return (
    <RedirectionGuard condition={false} isLoading={false} route="">
      <BaseLayout
        breadcrumb={
          <OdsBreadcrumb>
            <OdsBreadcrumbItem
              label={project?.description}
              href={hrefProject}
            />
            <OdsBreadcrumbItem
              label={t('pci_projects_project_storages_snapshots_title', {
                ns: 'volumes',
              })}
              href={hrefListing}
            />
            <OdsBreadcrumbItem
              label={t(
                'pci_projects_project_storages_snapshots_snapshot_create-volume_title',
              )}
              href="#"
            />
          </OdsBreadcrumb>
        }
        header={{
          title: t(
            'pci_projects_project_storages_snapshots_snapshot_create-volume_title',
          ),
        }}
      >
        {!snapshot?.volume ? (
          <OdsSpinner />
        ) : (
          <PciStorageVolumeEdit
            projectId={projectId || ''}
            volume={snapshot.volume}
            suggestedName={snapshot.name}
            onSubmit={handleSubmit}
            onCancel={goBack}
            submitLabel={t(
              'pci_projects_project_storages_snapshots_snapshot_create-volume_submit_label',
            )}
          />
        )}
      </BaseLayout>
    </RedirectionGuard>
  );
}
