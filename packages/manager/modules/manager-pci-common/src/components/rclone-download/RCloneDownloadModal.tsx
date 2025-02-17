import {
  Links,
  LinkType,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import {
  OdsFormField,
  OdsText,
  OdsLink,
  OdsRadio,
} from '@ovhcloud/ods-components/react';
import React, { useCallback, useContext, useState } from 'react';
import { Translation, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  OdsRadioChangeEventDetail,
  OdsRadioCustomEvent,
} from '@ovhcloud/ods-components';
import {
  DOWNLOAD_FILETYPE,
  DOWNLOAD_RCLONE_FILENAME,
  RCLONE_GUIDE,
} from './constants';
import SelectS3StorageRegions from './SelectS3StorageRegions';
import StorageRegions from './StorageRegions';

import { useDownloadRCloneConfig } from '../../api/hook/useRclone';

import '../../translations/rclone-download';
import { PciModal } from '../modal';

import '../../index.css';

type RCloneDownloadModalProps = { userId: string };

export function RCloneDownloadModal({
  userId,
}: Readonly<RCloneDownloadModalProps>) {
  const { t } = useTranslation('pci-rclone-download');

  const { projectId } = useParams();

  const navigate = useNavigate();
  const { addSuccess, addError } = useNotifications();

  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();

  const [fileType, setFileType] = useState(DOWNLOAD_FILETYPE.SWIFT);
  const [region, setRegion] = useState('');

  const handleFileTypeChanged = useCallback(
    (event: OdsRadioCustomEvent<OdsRadioChangeEventDetail>) => {
      const type = event.detail.value || '';
      setFileType(type);
    },
    [setFileType],
  );

  const rCloneGuideURL = RCLONE_GUIDE[ovhSubsidiary] || RCLONE_GUIDE.DEFAULT;

  const { download, isLoading } = useDownloadRCloneConfig({
    projectId,
    userId,
    onError: (error) => {
      navigate(`..`);
      addError(
        <Translation ns="pci-rclone-download">
          {(_t) =>
            _t('pci_projects_project_users_download-rclone_error_rclone', {
              message: error?.response?.data?.message || error?.message || null,
            })
          }
        </Translation>,
        true,
      );
    },
    onSuccess: (content: string) => {
      navigate(`..`);
      addSuccess(
        <Translation ns="pci-rclone-download">
          {(_t) => (
            <OdsText>
              {_t('pci_projects_project_users_download-rclone_success_message')}
              <OdsLink
                label={t(
                  'pci_projects_project_users_download-rclone_success_message_link',
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
    },
  });

  const onConfirm = () => download({ region, fileType });

  return (
    <PciModal
      title={t('pci_projects_project_users_download-rclone_title')}
      onCancel={() => navigate(`..`)}
      onClose={() => navigate(`..`)}
      onConfirm={onConfirm}
      isPending={isLoading}
      isDisabled={isLoading}
      submitText={t('pci_projects_project_users_download-rclone_submit_label')}
      cancelText={t('pci_projects_project_users_download-rclone_cancel_label')}
    >
      <OdsText preset="paragraph">
        {t('pci_projects_project_users_download-rclone_content')}
        {rCloneGuideURL && (
          <Links
            className="ml-3"
            href={rCloneGuideURL}
            target="_blank"
            type={LinkType.external}
            label={t('pci_projects_project_users_download-rclone_more_link')}
          />
        )}
      </OdsText>

      <OdsFormField className="block my-6">
        <OdsText preset="caption" className="label-caption-bold">
          {t('pci_projects_project_users_download-rclone_file_type_label')}
        </OdsText>

        <div className="flex gap-8">
          <div className="flex gap-4 items-center">
            <OdsRadio
              value={DOWNLOAD_FILETYPE.SWIFT}
              inputId="fileType-swift"
              name="fileType"
              isChecked
              color="primary"
              onOdsChange={handleFileTypeChanged}
            />
            <label htmlFor="fileType-swift">
              <OdsText>{DOWNLOAD_FILETYPE.SWIFT}</OdsText>
            </label>
          </div>

          <div className="flex gap-4 items-center">
            <OdsRadio
              value={DOWNLOAD_FILETYPE.S3}
              name="fileType"
              inputId="fileType-s3"
              onOdsChange={handleFileTypeChanged}
            />
            <label htmlFor="fileType-s3">
              <OdsText>{DOWNLOAD_FILETYPE.S3}</OdsText>
            </label>
          </div>
        </div>
      </OdsFormField>

      <OdsFormField className="w-full">
        <OdsText preset="caption" className="label-caption-bold">
          {t('pci_projects_project_users_download-rclone_region_label')}
        </OdsText>

        {fileType === DOWNLOAD_FILETYPE.S3 ? (
          <SelectS3StorageRegions
            projectId={projectId}
            onS3StorageRegionChange={setRegion}
          />
        ) : (
          <StorageRegions
            projectId={projectId}
            onStorageRegionChange={setRegion}
          />
        )}
      </OdsFormField>
    </PciModal>
  );
}
