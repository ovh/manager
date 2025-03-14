import { PciModal, useDownloadRCloneConfig } from '@ovh-ux/manager-pci-common';
import {
  useNotifications,
  useTranslatedMicroRegions,
} from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  OdsFormField,
  OdsText,
  OdsSelect,
  OdsLink,
} from '@ovhcloud/ods-components/react';
import { useContext, useEffect, useState } from 'react';
import { Translation, useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useProductRegionsAvailability } from '@/api/hooks/useRegions';
import {
  DOWNLOAD_FILETYPE,
  DOWNLOAD_RCLONE_FILENAME,
  RCLONE_GUIDE,
} from '@/constants';
import { COLD_ARCHIVE_TRACKING } from '@/tracking.constants';
import { useTracking } from '@/hooks/useTracking';

export default function RCloneDownload() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId') || '';
  const { translateMicroRegion } = useTranslatedMicroRegions();

  const { t } = useTranslation('users/download-rclone');

  const { projectId } = useParams();

  const navigate = useNavigate();
  const goBack = () => navigate('..');
  const { addSuccess, addError } = useNotifications();

  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();
  const {
    data: regions,
    isPending: isRegionsPending,
  } = useProductRegionsAvailability(
    ovhSubsidiary,
    'coldarchive.archive.hour.consumption',
  );

  const {
    trackConfirmAction,
    trackCancelAction,
    trackSuccessPage,
    trackErrorPage,
  } = useTracking(
    `${COLD_ARCHIVE_TRACKING.USER.MAIN}::${COLD_ARCHIVE_TRACKING.USER.ACTIONS.DOWNLOAD_RCLONE}`,
  );

  const rCloneGuideURL = RCLONE_GUIDE[ovhSubsidiary] || RCLONE_GUIDE.DEFAULT;

  const [region, setRegion] = useState('');

  useEffect(() => {
    if (regions?.length) {
      setRegion(regions[0]);
    }
  }, [regions]);

  const { download, isLoading } = useDownloadRCloneConfig({
    projectId,
    userId,
    onError: (error) => {
      addError(
        <Translation ns="users/download-rclone">
          {(_t) =>
            _t(
              'pci_projects_project_storages_cold_archive_users_download-rclone_error_rclone',
              {
                message:
                  error?.response?.data?.message || error?.message || null,
              },
            )
          }
        </Translation>,
        true,
      );
      trackErrorPage();
      goBack();
    },
    onSuccess: (content: string) => {
      addSuccess(
        <Translation ns="users/download-rclone">
          {(_t) => (
            <OdsText>
              {_t(
                'pci_projects_project_storages_cold_archive_users_download-rclone_success_message',
              )}
              <OdsLink
                label={t(
                  'pci_projects_project_storages_cold_archive_users_download-rclone_success_message_link',
                )}
                href={content}
                className="ml-3"
                color="primary"
                download={DOWNLOAD_RCLONE_FILENAME}
                target="_top"
              />
            </OdsText>
          )}
        </Translation>,
        true,
      );
      trackSuccessPage();
      goBack();
    },
  });

  const handleConfirm = () => {
    trackConfirmAction();
    download({ region, fileType: DOWNLOAD_FILETYPE.S3 });
  };

  const handleCancel = () => {
    trackCancelAction();
    goBack();
  };

  return (
    <PciModal
      title={t(
        'pci_projects_project_storages_cold_archive_users_download-rclone_title',
      )}
      onCancel={handleCancel}
      onClose={handleCancel}
      onConfirm={handleConfirm}
      isPending={isLoading || isRegionsPending}
      isDisabled={isLoading}
      submitText={t(
        'pci_projects_project_storages_cold_archive_users_download-rclone_submit_label',
      )}
      cancelText={t(
        'pci_projects_project_storages_cold_archive_users_download-rclone_cancel_label',
      )}
    >
      <OdsText preset="paragraph">
        {t(
          'pci_projects_project_storages_cold_archive_users_download-rclone_content',
        )}
        {rCloneGuideURL && (
          <OdsLink
            className="ml-3"
            href={rCloneGuideURL}
            target="_blank"
            icon="external-link"
            label={t(
              'pci_projects_project_storages_cold_archive_users_download-rclone_more_link',
            )}
          />
        )}
      </OdsText>
      <OdsFormField className="w-full">
        <OdsSelect
          value={region}
          name="currentRegion"
          data-testid="s3StorageRegions_select"
          onOdsChange={(event) => {
            const { value } = event.target;
            // Little hack to avoid the empty value at the loading of page because
            // the onOdsChange event is triggered with null value needlessly
            // Can be removed when the issue is fixed in OdsSelect component
            if (value) {
              setRegion(event.detail.value);
            }
          }}
        >
          {regions?.map((r: string) => (
            <option key={r} value={r}>
              {translateMicroRegion(r)}
            </option>
          ))}
        </OdsSelect>
      </OdsFormField>
    </PciModal>
  );
}
