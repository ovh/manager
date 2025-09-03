import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BaseLayout,
  ChangelogButton,
  PciGuidesHeader,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
  OdsSpinner,
} from '@ovhcloud/ods-components/react';
import { useHref, useNavigate, useParams } from 'react-router-dom';
import { TVolume, useProject } from '@ovh-ux/manager-pci-common';
import {
  PageType,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { ApiError } from '@ovh-ux/manager-core-api';
import VolumeEdit from './VolumeEdit.component';
import { useNotifications } from '@/hooks/notifications/useNotifications';
import { VOLUME_BACKUP_TRACKING } from '@/tracking.constant';
import {
  TNewVolumeFromBackupData,
  useCreateVolumeFromBackup,
  useVolume,
} from '@/data/hooks/useVolume';
import { useBackups } from '@/data/hooks/useVolumeBackup';
import config from '@/pci-volume-backup.config';

function useParam(param: string): string {
  const { [param]: paramValue } = useParams();
  if (!paramValue) {
    throw new Error(`Missing ${param} in URL.`);
  }
  return paramValue;
}

export default function CreateVolumePage() {
  const { t } = useTranslation(['create-volume', 'listing']);
  const { addSuccessMessage, addErrorMessage } = useNotifications({
    ns: 'create-volume',
  });
  const navigate = useNavigate();
  const projectId = useParam('projectId');
  const backupId = useParam('backupId');
  const hrefProject = useProjectUrl('public-cloud');
  const { data: project } = useProject();
  const { trackClick, trackPage } = useOvhTracking();
  const { shell } = useContext(ShellContext);
  const hrefListing = useHref('..');
  const goBack = () => navigate('..');

  const { data: allBackups, isLoading: isBackupsLoading } = useBackups(
    projectId,
  );
  const backup = useMemo(() => {
    const matchingBackup = (allBackups?.data || []).find(
      (d) => d.id === backupId,
    );
    return matchingBackup || null;
  }, [allBackups, backupId]);
  const { data: volume, isLoading: isVolumeLoading } = useVolume(
    projectId,
    backup?.volumeId || '',
  );

  const { createVolumeFromBackup, isPending } = useCreateVolumeFromBackup({
    projectId: projectId || '',
    onSuccess: (newVolume: TVolume) => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: VOLUME_BACKUP_TRACKING.CREATE_VOLUME.REQUEST_SUCCESS,
      });
      addSuccessMessage({
        i18nKey:
          'pci_projects_project_storages_volume_backup_list_create_volume_request_success',
        values: { volumeName: newVolume.name },
      });
      shell?.navigation?.navigateTo(
        'public-cloud',
        `#/pci/projects/${projectId}/storages/blocks`,
        {},
      );
    },
    onError: (error: ApiError, data: TNewVolumeFromBackupData) => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: VOLUME_BACKUP_TRACKING.CREATE_VOLUME.REQUEST_FAIL,
      });
      addErrorMessage({
        i18nKey:
          'pci_projects_project_storages_volume_backup_list_create_volume_request_fail',
        values: { volumeName: data.volumeName },
        error,
      });
      goBack();
    },
  });

  if (isBackupsLoading || !backup || !volume || isVolumeLoading) {
    return <OdsSpinner />;
  }

  const handleSubmit = (editedVolume: Partial<TVolume>) => {
    trackClick({
      actionType: 'action',
      actions: VOLUME_BACKUP_TRACKING.CREATE_VOLUME.CTA_CONFIRM,
    });
    createVolumeFromBackup({
      regionName: volume.region,
      volumeBackupId: backup.id,
      volumeName: editedVolume.name || '',
    });
  };

  const handleCancel = () => {
    trackClick({
      actionType: 'action',
      actions: VOLUME_BACKUP_TRACKING.CREATE_VOLUME.CTA_CANCEL,
    });
    goBack();
  };

  const header = {
    title: t('pci_projects_project_storages_volume_backup_list_header', {
      ns: 'listing',
    }),
    subtitle: t(
      'pci_projects_project_storages_volume_backup_list_create_volume_title',
    ),
    headerButton: <PciGuidesHeader category="volumeBackup" />,
    changelogButton: <ChangelogButton links={config.changeLogLinks} />,
  };

  return (
    <BaseLayout
      breadcrumb={
        <OdsBreadcrumb>
          <OdsBreadcrumbItem label={project?.description} href={hrefProject} />
          <OdsBreadcrumbItem
            label={t(
              'pci_projects_project_storages_volume_backup_list_header',
              {
                ns: 'listing',
              },
            )}
            href={hrefListing}
          />
          <OdsBreadcrumbItem
            label={t(
              'pci_projects_project_storages_volume_backup_list_create_volume_breadcrumb',
            )}
            href="#"
          />
        </OdsBreadcrumb>
      }
      header={header}
    >
      {!backup?.volumeId || !volume || isPending ? (
        <OdsSpinner />
      ) : (
        <VolumeEdit
          projectId={projectId}
          volume={volume}
          sizeDisabled={true}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitLabel={t(
            'pci_projects_project_storages_volume_backup_list_create_volume_action_confirm',
          )}
        />
      )}
    </BaseLayout>
  );
}
