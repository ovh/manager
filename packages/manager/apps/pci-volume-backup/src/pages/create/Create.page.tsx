import {
  BaseLayout,
  Notifications,
  PciGuidesHeader,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';

import {
  BACKUP_NAME_PREFIX,
  VOLUME_OPTION_BACKUP,
  VOLUME_OPTION_SNAPSHOT,
} from '@/constants';
import {
  useCreateVolumeBackup,
  useCreateVolumeSnapshot,
} from '@/data/hooks/useVolumeBackup';
import { useNotifications } from '@/hooks/notifications/useNotifications';
import { VOLUME_BACKUP_TRACKING } from '@/tracking.constant';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  PciDiscoveryBanner,
  TVolume,
  useProject,
  useVolumes,
} from '@ovh-ux/manager-pci-common';
import {
  PageType,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import {
  OdsInputChangeEventDetail,
  OdsInputCustomEvent,
  OdsSelectChangeEventDetail,
  OdsSelectCustomEvent,
} from '@ovhcloud/ods-components';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
  OdsButton,
  OdsLink,
  OdsMessage,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { formatISO } from 'date-fns';
import { useContext, useMemo, useState } from 'react';
import { useHref, useNavigate, useParams } from 'react-router-dom';
import BackupNameStep from './steps/BackupNameStep';
import BackupOptionStep, { TBackupOption } from './steps/BackupOptionStep';
import VolumeSelectStep from './steps/VolumeSelectStep';
import DetachVolumeStep from './steps/DetachVolumeStep';

const DEFAULT_BACKUP_OPTIONS: TBackupOption[] = [
  {
    id: 'volume_snapshot',
    planCode: 'volume.snapshot.consumption',
    type: VOLUME_OPTION_SNAPSHOT,
    isDisabled: true,
    price: null,
  },
  {
    id: 'volume_backup',
    planCode: 'volume-backup.storage.hour.consumption',
    type: VOLUME_OPTION_BACKUP,
    isDisabled: true,
    price: null,
  },
];

export default function CreateVolumeBackup() {
  const { t } = useTranslation(['create', 'pci-volume-backup']);

  const { projectId } = useParams();
  const navigate = useNavigate();
  const hrefProject = useProjectUrl('public-cloud');
  const { trackClick, trackPage } = useOvhTracking();

  const { shell } = useContext(ShellContext);

  const { addSuccessMessage, addErrorMessage } = useNotifications({
    ns: 'create',
  });

  const { data: project } = useProject();
  const { data: volumes } = useVolumes(projectId || '');

  const goBack = () => navigate('..');

  const blockStorageUrl = `${hrefProject}/storages/blocks`;

  const {
    createVolumeBackup,
    isPending: isVolumeBackupCreationPending,
  } = useCreateVolumeBackup({
    projectId: projectId || '',
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: VOLUME_BACKUP_TRACKING.CREATE.REQUEST_SUCCESS,
      });

      addSuccessMessage({
        i18nKey:
          'pci_projects_project_storages_volume_backup_create_action_create_option_volume_backup_success',
        values: {
          backupName: `<strong>${backupName}</strong>`,
        },
      });

      goBack();
    },
    onError: (error: ApiError) => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: VOLUME_BACKUP_TRACKING.CREATE.REQUEST_FAIL,
      });

      addErrorMessage({
        i18nKey:
          'pci_projects_project_storages_volume_backup_create_action_create_volume_backup_fail',
        error,
      });

      goBack();
    },
  });

  const {
    createVolumeSnapshot,
    isPending: isVolumeSnapshotCreationPending,
  } = useCreateVolumeSnapshot({
    projectId: projectId || '',
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: VOLUME_BACKUP_TRACKING.CREATE.REQUEST_SUCCESS,
      });

      addSuccessMessage({
        i18nKey:
          'pci_projects_project_storages_volume_backup_create_action_create_option_volume_snapshot_success',
        values: {
          backupName: `<strong>${backupName}</strong>`,
        },
      });

      shell.navigation.navigateTo(
        'public-cloud',
        `#/pci/projects/${projectId}/storages/volume-snapshots`,
        {},
      );
    },
    onError: (error: ApiError) => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: VOLUME_BACKUP_TRACKING.CREATE.REQUEST_FAIL,
      });

      addErrorMessage({
        i18nKey:
          'pci_projects_project_storages_volume_backup_create_action_create_volume_backup_fail',
        error,
      });

      shell.navigation.navigateTo(
        'public-cloud',
        `#/pci/projects/${projectId}/storages/volume-snapshots`,
        {},
      );
    },
  });

  const [selectedVolume, setSelectedVolume] = useState<TVolume>();
  const [selectedBackup, setSelectedBackup] = useState<TBackupOption>();
  const [backupName, setBackupName] = useState('');
  const [backupOptions, setVolumeOptions] = useState<TBackupOption[]>(
    DEFAULT_BACKUP_OPTIONS,
  );

  const isSelectedVolumeNeedToDetach = useMemo(
    () =>
      selectedVolume &&
      selectedBackup &&
      selectedVolume.attachedTo?.length > 0 &&
      selectedBackup.type === VOLUME_OPTION_BACKUP,
    [selectedVolume, selectedBackup],
  );

  const handleVolumeSelect = (
    event: OdsSelectCustomEvent<OdsSelectChangeEventDetail>,
  ) => {
    const volumeId = event?.detail?.value;

    if (volumeId) {
      const selectedVolume = volumes?.find((v) => v.id === volumeId);
      setSelectedVolume(selectedVolume);
      setVolumeOptions((prevState) =>
        prevState.map((volumeOption) => ({
          ...volumeOption,
          isDisabled: false,
        })),
      );
    }
  };

  const handleBackupNameChange = (
    event: OdsInputCustomEvent<OdsInputChangeEventDetail>,
  ) => {
    const backupName = `${event?.detail?.value}`;
    setBackupName(backupName);
  };

  const handleBackupOptionChange = (option: TBackupOption) => {
    setSelectedBackup(option);

    // Generate default backup name
    if (selectedVolume?.name) {
      const volumeTypePrefix = BACKUP_NAME_PREFIX[option.type];
      const timestamp = formatISO(new Date());
      setBackupName(`${volumeTypePrefix}-${selectedVolume.name}-${timestamp}`);
    }
  };

  const isFormValid = () =>
    selectedVolume &&
    selectedBackup &&
    backupName &&
    (selectedBackup.type === VOLUME_OPTION_SNAPSHOT ||
      (selectedBackup.type === VOLUME_OPTION_BACKUP &&
        selectedVolume.attachedTo.length === 0));

  const handleCreateBackupClick = () => {
    trackClick({
      actionType: 'action',
      actions: [VOLUME_BACKUP_TRACKING.CREATE.CTA_CONFIRM],
    });

    if (
      selectedVolume?.region &&
      selectedVolume?.id &&
      backupName &&
      selectedBackup?.type
    ) {
      selectedBackup.type === VOLUME_OPTION_SNAPSHOT
        ? createVolumeSnapshot({
            regionName: selectedVolume?.region,
            volumeId: selectedVolume?.id,
            backupName: backupName,
          })
        : createVolumeBackup({
            regionName: selectedVolume?.region,
            volumeId: selectedVolume?.id,
            backupName: backupName,
          });
    }
  };

  return (
    <BaseLayout
      header={{
        title: t('pci_projects_project_storages_volume_backup_create_header'),
        headerButton: <PciGuidesHeader category="volumeBackup" />,
      }}
      description={t(
        'pci_projects_project_storages_volume_backup_create_description',
      )}
      breadcrumb={
        <OdsBreadcrumb>
          <OdsBreadcrumbItem href={hrefProject} label={project?.description} />
          <OdsBreadcrumbItem
            href={useHref('..')}
            label={t('pci_projects_project_storages_volume_backup_breadcrumb', {
              ns: 'pci-volume-backup',
            })}
          />
          <OdsBreadcrumbItem
            href="#"
            label={t(
              'pci_projects_project_storages_volume_backup_create_breadcrumb',
            )}
          />
        </OdsBreadcrumb>
      }
      message={
        volumes?.length === 0 ? (
          <OdsMessage isDismissible={false}>
            <div className="flex flex-col gap-4">
              <OdsText>
                {t(
                  'pci_projects_project_storages_volume_backup_create_banner_no_volumes_description',
                )}
              </OdsText>
              <OdsLink
                icon="external-link"
                target="_blank"
                href={blockStorageUrl}
                label={t(
                  'pci_projects_project_storages_volume_backup_create_step_2_description_link',
                )}
              />
            </div>
          </OdsMessage>
        ) : (
          undefined
        )
      }
    >
      <div className="my-4">
        <Notifications />
      </div>

      {project && <PciDiscoveryBanner project={project} />}

      <div className="flex flex-col gap-10 md:max-w-[70%]">
        <VolumeSelectStep
          selectedVolume={selectedVolume}
          onVolumeChange={handleVolumeSelect}
        />

        <BackupOptionStep
          selectedVolume={selectedVolume}
          selectedBackup={selectedBackup}
          onBackupChange={handleBackupOptionChange}
          backupOptions={backupOptions}
        />

        {isSelectedVolumeNeedToDetach && <DetachVolumeStep />}

        <BackupNameStep
          backupName={backupName}
          onBackupNameChange={handleBackupNameChange}
        />

        <OdsButton
          label={t(
            'pci_projects_project_storages_volume_backup_create_action_create',
          )}
          color="primary"
          isDisabled={!isFormValid()}
          isLoading={
            isVolumeBackupCreationPending || isVolumeSnapshotCreationPending
          }
          onClick={handleCreateBackupClick}
        />
      </div>
    </BaseLayout>
  );
}
