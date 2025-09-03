import { ApiError } from '@ovh-ux/manager-core-api';
import {
  PciDiscoveryBanner,
  useProject,
  useVolumes,
} from '@ovh-ux/manager-pci-common';
import {
  BaseLayout,
  Notifications,
  PciGuidesHeader,
  useNotifications as useMRCNotifications,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
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
import { Suspense, useCallback, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useHref, useNavigate, useParams } from 'react-router-dom';
import { VOLUME_BACKUP_TRACKING } from '@/tracking.constant';
import { useNotifications } from '@/hooks/notifications/useNotifications';
import {
  useCreateVolumeBackup,
  useCreateVolumeSnapshot,
} from '@/data/hooks/useVolumeBackup';
import {
  BACKUP_NAME_PREFIX,
  VOLUME_OPTION_BACKUP,
  VOLUME_OPTION_SNAPSHOT,
} from '@/constants';
import BackupNameStep from './steps/BackupNameStep';
import BackupOptionStep, { TBackupOption } from './steps/BackupOptionStep';
import DetachVolumeStep from './steps/DetachVolumeStep';
import VolumeSelectStep from './steps/VolumeSelectStep';

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
  const { trackClick, trackPage } = useOvhTracking();
  const { shell } = useContext(ShellContext);

  const hrefProject = useProjectUrl('public-cloud');
  const blockStorageUrl = `${hrefProject}/storages/blocks`;
  const backupsHref = useHref('..');

  const { addSuccessMessage, addErrorMessage } = useNotifications({
    ns: 'create',
  });
  const { clearNotifications } = useMRCNotifications();

  const [selectedVolumeId, setSelectedVolumeId] = useState<string>('');
  const [selectedBackup, setSelectedBackup] = useState<TBackupOption>();
  const [backupName, setBackupName] = useState('');
  const [backupOptions, setBackupOptions] = useState<TBackupOption[]>(
    DEFAULT_BACKUP_OPTIONS,
  );

  const goBack = () => navigate('..');

  const { data: project } = useProject();
  const { data: volumes } = useVolumes(projectId || '');

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

      shell?.navigation.navigateTo(
        'public-cloud',
        `#/pci/projects/${projectId}/storages/volume-snapshots?notificationType=success&notificationMsg=${encodeURIComponent(
          t(
            'pci_projects_project_storages_volume_backup_create_action_create_option_volume_snapshot_success',
            {
              backupName: `<strong>${backupName}</strong>`,
              ns: 'create',
            },
          ),
        )}`,
        {},
      );
    },
    onError: (error: ApiError) => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: VOLUME_BACKUP_TRACKING.CREATE.REQUEST_FAIL,
      });

      shell?.navigation.navigateTo(
        'public-cloud',
        `#/pci/projects/${projectId}/storages/volume-snapshots?notificationType=error&notificationMsg=${encodeURIComponent(
          t(
            'pci_projects_project_storages_volume_backup_create_action_create_volume_backup_fail',
            {
              message: error?.response?.data?.message || error?.message || null,
              ns: 'create',
            },
          ),
        )}`,
        {},
      );
    },
  });

  const generateBackupName = (
    volumeName: string | undefined,
    backupOptionType: TBackupOption['type'] | undefined,
  ) => {
    if (volumeName && backupOptionType) {
      const volumeTypePrefix = BACKUP_NAME_PREFIX[backupOptionType];
      const timestamp = formatISO(new Date());
      setBackupName(`${volumeTypePrefix}-${volumeName}-${timestamp}`);
    }
  };

  const selectedVolume = useMemo(() => {
    const searchedVolume = volumes?.find(({ id }) => id === selectedVolumeId);
    generateBackupName(searchedVolume?.name, selectedBackup?.type);
    return searchedVolume;
  }, [volumes, selectedVolumeId]);

  const isSelectedVolumeNeedToDetach = useMemo(
    () =>
      selectedVolume &&
      selectedBackup &&
      selectedVolume.attachedTo?.length > 0 &&
      selectedBackup.type === VOLUME_OPTION_BACKUP,
    [selectedVolume, selectedBackup],
  );

  const handleVolumeChange = (
    event: OdsSelectCustomEvent<OdsSelectChangeEventDetail>,
  ) => {
    const volumeId = event?.detail?.value;

    if (volumeId) {
      setSelectedVolumeId(volumeId);
      setBackupOptions((prevState) =>
        prevState.map((volumeOption) => ({
          ...volumeOption,
          isDisabled: false,
        })),
      );
    }
  };

  const handleBackupOptionChange = (option: TBackupOption) => {
    setSelectedBackup(option);
    trackClick({
      actionType: 'action',
      actions: [...VOLUME_BACKUP_TRACKING.CREATE.CARD_CLICK, option.id],
    });
    generateBackupName(selectedVolume?.name, option?.type);
  };

  const isFormValid = useCallback(
    () =>
      selectedVolume &&
      selectedBackup &&
      backupName &&
      (selectedBackup.type === VOLUME_OPTION_SNAPSHOT ||
        (selectedBackup.type === VOLUME_OPTION_BACKUP &&
          selectedVolume.attachedTo?.length === 0)),
    [selectedVolume, selectedBackup, backupName],
  );

  const handleCreateBackupClick = () => {
    clearNotifications();

    if (
      selectedVolume?.region &&
      selectedVolume?.id &&
      backupName &&
      selectedBackup?.type
    ) {
      if (selectedBackup.type === VOLUME_OPTION_SNAPSHOT) {
        trackClick({
          actionType: 'action',
          actions: VOLUME_BACKUP_TRACKING.CREATE.CTA_CONFIRM_SNAPSHOT,
        });
        createVolumeSnapshot({
          regionName: selectedVolume?.region,
          volumeId: selectedVolume?.id,
          backupName,
        });
      } else {
        trackClick({
          actionType: 'action',
          actions: VOLUME_BACKUP_TRACKING.CREATE.CTA_CONFIRM_BACKUP,
        });
        createVolumeBackup({
          regionName: selectedVolume?.region,
          volumeId: selectedVolume?.id,
          backupName,
        });
      }
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
            href={backupsHref}
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
    >
      <div className="flex flex-col gap-4 mb-8">
        {project && <PciDiscoveryBanner project={project} />}

        {volumes?.length === 0 && (
          <OdsMessage isDismissible={false} className="w-full">
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
                  'pci_projects_project_storages_volume_backup_create_banner_no_volumes_link',
                )}
              />
            </div>
          </OdsMessage>
        )}

        <Notifications />
      </div>

      <div className="flex flex-col gap-10 md:max-w-[70%]">
        <VolumeSelectStep
          volumes={volumes}
          selectedVolumeId={selectedVolumeId}
          onVolumeChange={handleVolumeChange}
        />

        <BackupOptionStep
          selectedVolume={selectedVolume}
          setSelectedBackup={setSelectedBackup}
          selectedBackup={selectedBackup}
          onBackupChange={handleBackupOptionChange}
          backupOptions={backupOptions}
        />

        {isSelectedVolumeNeedToDetach && (
          <DetachVolumeStep
            volume={selectedVolume}
            resetForm={() => setSelectedBackup(undefined)}
          />
        )}

        <BackupNameStep
          backupName={backupName}
          onBackupNameChange={(
            event: OdsInputCustomEvent<OdsInputChangeEventDetail>,
          ) => setBackupName(`${event?.detail?.value}`)}
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
      <Suspense>
        <Outlet />
      </Suspense>
    </BaseLayout>
  );
}
