import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BaseLayout,
  ChangelogButton,
  PciGuidesHeader,
  useNotifications,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
  OdsSpinner,
} from '@ovhcloud/ods-components/react';
import { useParams, useHref, useNavigate } from 'react-router-dom';
import { TVolume, useProject } from '@ovh-ux/manager-pci-common';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import VolumeEdit from './VolumeEdit.component';
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
  const { addError } = useNotifications();
  const navigate = useNavigate();
  const projectId = useParam('projectId');
  const backupId = useParam('backupId');
  const hrefProject = useProjectUrl('public-cloud');
  const { data: project } = useProject();
  const { shell } = useContext(ShellContext);
  const { tracking } = shell;
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
    onSuccess: () => {
      tracking?.trackClick({
        name: VOLUME_BACKUP_TRACKING.CREATE_VOLUME.REQUEST_SUCCESS,
        type: 'event',
      });
      shell.navigation.navigateTo(
        'public-cloud',
        `#/pci/projects/${projectId}/storages/blocks`,
        {},
      );
    },
    onError: (err: Error, data: TNewVolumeFromBackupData) => {
      tracking?.trackClick({
        name: VOLUME_BACKUP_TRACKING.CREATE_VOLUME.REQUEST_FAIL,
        type: 'event',
      });
      goBack();
      addError(
        t(
          'pci_projects_project_storages_volume_backup_list_create_volume_request_fail',
          { volume: data.volumeName, message: err },
        ),
      );
    },
  });

  if (isBackupsLoading || !backup || !volume || isVolumeLoading) {
    return <OdsSpinner />;
  }

  const handleSubmit = (editedVolume: Partial<TVolume>) => {
    tracking?.trackClick({
      name: VOLUME_BACKUP_TRACKING.CREATE_VOLUME.CTA_CONFIRM,
      type: 'action',
    });
    createVolumeFromBackup({
      regionName: volume.region,
      volumeBackupId: backup.id,
      volumeName: editedVolume.name || '',
    });
  };

  const handleCancel = () => {
    tracking?.trackClick({
      name: VOLUME_BACKUP_TRACKING.CREATE_VOLUME.CTA_CANCEL,
      type: 'action',
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
