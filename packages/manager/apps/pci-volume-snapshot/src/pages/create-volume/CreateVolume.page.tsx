import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BaseLayout,
  PciGuidesHeader,
  RedirectionGuard,
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
import { TVolumeSnapshot, useVolumeSnapshots } from '@/api/hooks/useSnapshots';

export default function CreateVolumePage() {
  const { t } = useTranslation(['create-volume', 'volumes']);
  const navigate = useNavigate();
  const { projectId, snapshotId } = useParams();
  const hrefProject = useProjectUrl('public-cloud');
  const { data: project } = useProject();
  const hrefListing = useHref('./../..');
  const goBack = () => navigate('./../..');

  // TODO: update
  const { data: allSnapshots, error, isLoading } = useVolumeSnapshots(
    projectId || 'NO_PROJECT_ID',
  );
  const snapshot: TVolumeSnapshot | null = useMemo(
    () => allSnapshots.find((d) => d.id === snapshotId) || null,
    [allSnapshots, snapshotId],
  );

  if (!snapshot) {
    return <OdsSpinner />;
  }
  //
  // console.group('[default] CreateVolumePage');
  // console.log('snapshot: ', snapshot);
  // console.groupEnd();

  const handleSubmit = () => {
    console.log('[CreateVolume] handleSubmit.');
  };

  return (
    <RedirectionGuard condition={false} isLoading={false} route={''}>
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
              href={'#'}
            />
          </OdsBreadcrumb>
        }
        header={{
          title: t(
            'pci_projects_project_storages_snapshots_snapshot_create-volume_title',
          ),
          headerButton: <PciGuidesHeader category={'storage'} />,
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
