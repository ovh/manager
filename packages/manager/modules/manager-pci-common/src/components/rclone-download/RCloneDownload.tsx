import {
  Links,
  LinkType,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_RADIO_BUTTON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  OsdsRadioGroupCustomEvent,
} from '@ovhcloud/ods-components';
import {
  OsdsFormField,
  OsdsRadio,
  OsdsRadioButton,
  OsdsRadioGroup,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useCallback, useContext, useState } from 'react';
import { Translation, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { DOWNLOAD_FILETYPE, RCLONE_GUIDE } from './constants';
import S3StorageRegions from './S3StorageRegions';
import StorageRegions from './StorageRegions';

import { useDownloadRCloneConfig } from '../../api/hook/useRclone';

import '../../translations/rclone-download';
import { PciModal } from '../modal';

export default function RCloneDownloadModal({ userId }: { userId: string }) {
  const { t } = useTranslation('pci-rclone-download');

  const { projectId } = useParams();

  const navigate = useNavigate();
  const { addSuccess, addError } = useNotifications();

  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();

  const [fileType, setFileType] = useState(DOWNLOAD_FILETYPE.SWIFT as string);
  const [region, setRegion] = useState('');

  const handleFileTypeChanged = useCallback(
    (
      event: OsdsRadioGroupCustomEvent<{
        newValue?: string;
        previousValue?: string;
      }>,
    ) => {
      const type = `${event.detail.newValue}` || '';
      setFileType(type);
    },
    [setFileType],
  );

  const rCloneGuideURL = RCLONE_GUIDE[ovhSubsidiary];

  const { download, isLoading } = useDownloadRCloneConfig({
    projectId: `${projectId}`,
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
            <OsdsText>
              {_t('pci_projects_project_users_download-rclone_success_message')}
              <Links
                className="ml-3"
                href={content}
                target={OdsHTMLAnchorElementTarget._top}
                label={t(
                  'pci_projects_project_users_download-rclone_success_message_link',
                )}
              />
            </OsdsText>
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
      <OsdsText
        level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
        color={ODS_THEME_COLOR_INTENT.text}
        size={ODS_TEXT_SIZE._400}
      >
        {t('pci_projects_project_users_download-rclone_content')}
      </OsdsText>

      {rCloneGuideURL && (
        <Links
          className="ml-3"
          href={rCloneGuideURL}
          target={OdsHTMLAnchorElementTarget._blank}
          type={LinkType.external}
          label={t('pci_projects_project_users_download-rclone_more_link')}
        />
      )}

      <OsdsFormField className="mt-6 mb-8">
        <OsdsText
          className="font-bold"
          size={ODS_TEXT_SIZE._100}
          level={ODS_TEXT_LEVEL.caption}
          color={ODS_THEME_COLOR_INTENT.text}
          slot="label"
        >
          {t('pci_projects_project_users_download-rclone_file_type_label')}
        </OsdsText>
        <OsdsRadioGroup
          required
          className="flex"
          name="filetype-radiogroup"
          value={fileType}
          onOdsValueChange={handleFileTypeChanged}
        >
          <OsdsRadio
            value={DOWNLOAD_FILETYPE.SWIFT}
            name="swiftFileType"
            className="mr-4"
            color={ODS_THEME_COLOR_INTENT.primary}
          >
            <OsdsRadioButton
              size={ODS_RADIO_BUTTON_SIZE.xs}
              color={ODS_THEME_COLOR_INTENT.primary}
            >
              <OsdsText
                slot="end"
                size={ODS_THEME_TYPOGRAPHY_SIZE._500}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {DOWNLOAD_FILETYPE.SWIFT}
              </OsdsText>
            </OsdsRadioButton>
          </OsdsRadio>
          <OsdsRadio value={DOWNLOAD_FILETYPE.S3} name="s3FileType">
            <OsdsRadioButton
              size={ODS_RADIO_BUTTON_SIZE.xs}
              color={ODS_THEME_COLOR_INTENT.primary}
            >
              <OsdsText
                size={ODS_THEME_TYPOGRAPHY_SIZE._500}
                color={ODS_THEME_COLOR_INTENT.text}
                slot="end"
              >
                {DOWNLOAD_FILETYPE.S3}
              </OsdsText>
            </OsdsRadioButton>
          </OsdsRadio>
        </OsdsRadioGroup>
      </OsdsFormField>

      <OsdsFormField>
        <OsdsText
          className="font-bold"
          size={ODS_TEXT_SIZE._100}
          level={ODS_TEXT_LEVEL.caption}
          color={ODS_THEME_COLOR_INTENT.text}
          slot="label"
        >
          {t('pci_projects_project_users_download-rclone_region_label')}
        </OsdsText>

        {fileType === DOWNLOAD_FILETYPE.S3 ? (
          <S3StorageRegions
            projectId={projectId}
            onS3StorageRegionChange={setRegion}
          />
        ) : (
          <StorageRegions
            projectId={projectId}
            onStorageRegionChange={setRegion}
          />
        )}
      </OsdsFormField>
    </PciModal>
  );
}
