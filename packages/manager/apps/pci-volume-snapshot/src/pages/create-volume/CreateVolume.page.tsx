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
import { TVolume } from '@/api/api.types';
import { useVolumeSnapshot } from '@/api/hooks/useSnapshots';
import { useCreateVolume } from '@/api/hooks/useVolume';
import { TNewVolumeData } from '@/api/data/volume';
import { ROUTE_PATHS } from '@/routes';

function useParam(param: string): string {
  const { [param]: paramValue } = useParams();
  if (!paramValue) {
    throw new Error(`Missing ${param} in URL.`);
  }
  return paramValue;
}

export default function CreateVolumePage() {
  const { t } = useTranslation(['create-volume', 'volumes']);
  const { addError, addSuccess } = useNotifications();
  const navigate = useNavigate();
  const projectId = useParam('projectId');
  const snapshotId = useParam('snapshotId');
  const hrefProject = useProjectUrl('public-cloud');
  const { data: project } = useProject();
  const listingUrl = ROUTE_PATHS.ROOT.replace(':projectId', projectId);
  const blockStorageUrl = ROUTE_PATHS.BLOCK_STORAGE.replace(
    ':projectId',
    projectId,
  );
  const hrefListing = useHref(listingUrl);
  const goBack = () => navigate(listingUrl);

  const { data: snapshot, isPending: isSnapshotPending } = useVolumeSnapshot(
    projectId,
    snapshotId,
  );

  const { createVolume, isPending } = useCreateVolume({
    projectId: projectId || '',
    onSuccess: (newVolume: TVolume) => {
      navigate(blockStorageUrl);
      addSuccess(
        t(
          'pci_projects_project_storages_snapshots_snapshot_create-volume_success_message',
          { volume: newVolume.name },
        ),
      );
    },
    onError: (err: Error, newVolumeData: TNewVolumeData) => {
      goBack();
      addError(
        t(
          'pci_projects_project_storages_snapshots_snapshot_create-volume_error_post',
          { volume: newVolumeData.name, message: err },
        ),
      );
    },
  });

  if (isSnapshotPending || !snapshot) {
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
        {!snapshot?.volume || isPending ? (
          <OdsSpinner />
        ) : (
          <PciStorageVolumeEdit
            projectId={projectId}
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
