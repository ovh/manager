import {
  OsdsButton,
  OsdsFormField,
  OsdsIcon,
  OsdsLink,
  OsdsModal,
  OsdsRadio,
  OsdsRadioButton,
  OsdsRadioGroup,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_RADIO_BUTTON_SIZE,
  ODS_SPINNER_SIZE,
  OsdsRadioGroupCustomEvent,
} from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { useEnvironment } from '@ovh-ux/manager-react-shell-client';
import { useCallback, useState } from 'react';
import { useDownloadRCloneConfig } from '@/hooks/useUser';
import { DOWNLOAD_FILETYPE, RCLONE_GUIDE } from '@/download-rclone.constants';
import S3StorageRegions from '@/components/users/S3StorageRegions';
import StorageRegions from '@/components/users/StorageRegions';

interface RemoveRCloneDownloadModalProps {
  projectId: string;
  userId: string;
  onClose: () => void;
  onSuccess: (content: string) => void;
  onError: (cause: Error) => void;
}

export default function RCloneDownloadModal({
  projectId,
  userId,
  onClose,
  onSuccess,
  onError,
}: RemoveRCloneDownloadModalProps) {
  const { t } = useTranslation('common');
  const { ovhSubsidiary } = useEnvironment().getUser();
  const [fileType, setFileType] = useState(DOWNLOAD_FILETYPE.SWIFT as string);
  const [region, setRegion] = useState('');
  const { download, isLoading: isLoadingDownload } = useDownloadRCloneConfig({
    projectId: `${projectId}`,
    userId,
    onError: (err) => {
      onClose();
      onError(err);
    },
    onSuccess: (content: string) => {
      onClose();
      onSuccess(content);
    },
  });
  const handleFileTypeChanged = useCallback(
    (
      event: OsdsRadioGroupCustomEvent<{
        newValue?: string | undefined;
        previousValue?: string | undefined;
      }>,
    ) => {
      const type = `${event.detail.newValue}` || '';
      setFileType(type);
    },
    [setFileType],
  );
  const rCloneGuideURL = RCLONE_GUIDE[ovhSubsidiary];

  return (
    <>
      <OsdsModal
        headline={t('pci_projects_project_users_download-rclone_title')}
        onOdsModalClose={onClose}
      >
        <slot name="content">
          {!isLoadingDownload && (
            <>
              <OsdsText
                slot="label"
                level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {t('pci_projects_project_users_download-rclone_content')}
              </OsdsText>
              {rCloneGuideURL && (
                <OsdsLink
                  href={rCloneGuideURL}
                  className={'align-text-bottom ml-1'}
                  color={ODS_THEME_COLOR_INTENT.primary}
                  target={OdsHTMLAnchorElementTarget._blank}
                >
                  <span slot={'start'}>
                    <OsdsText
                      size={ODS_THEME_TYPOGRAPHY_SIZE._500}
                      color={ODS_THEME_COLOR_INTENT.primary}
                    >
                      {t(
                        'pci_projects_project_users_download-rclone_more_link',
                      )}
                    </OsdsText>
                    <OsdsIcon
                      name={ODS_ICON_NAME.EXTERNAL_LINK}
                      color={ODS_THEME_COLOR_INTENT.primary}
                      size={ODS_ICON_SIZE.xxs}
                      className={'ml-1'}
                    ></OsdsIcon>
                  </span>
                </OsdsLink>
              )}
              <OsdsFormField className={'mt-2'}>
                <OsdsText
                  slot="label"
                  level={ODS_THEME_TYPOGRAPHY_LEVEL.button}
                  color={ODS_THEME_COLOR_INTENT.text}
                >
                  {t(
                    'pci_projects_project_users_download-rclone_file_type_label',
                  )}
                </OsdsText>
                <OsdsRadioGroup
                  required={true}
                  className={'flex mb-4'}
                  name={'filetype-radiogroup'}
                  value={fileType}
                  onOdsValueChange={handleFileTypeChanged}
                  data-testid="downloadFileType"
                >
                  <OsdsRadio
                    value={DOWNLOAD_FILETYPE.SWIFT}
                    name={'filetype-radiogroup'}
                    className={'mr-4'}
                    color={ODS_THEME_COLOR_INTENT.primary}
                  >
                    <OsdsRadioButton
                      size={ODS_RADIO_BUTTON_SIZE.sm}
                      color={ODS_THEME_COLOR_INTENT.primary}
                    >
                      <OsdsText
                        slot={'end'}
                        size={ODS_THEME_TYPOGRAPHY_SIZE._500}
                        color={ODS_THEME_COLOR_INTENT.text}
                      >
                        {DOWNLOAD_FILETYPE.SWIFT}
                      </OsdsText>
                    </OsdsRadioButton>
                  </OsdsRadio>
                  <OsdsRadio
                    value={DOWNLOAD_FILETYPE.S3}
                    name={'filetype-radiogroup'}
                  >
                    <OsdsRadioButton
                      size={ODS_RADIO_BUTTON_SIZE.sm}
                      color={ODS_THEME_COLOR_INTENT.primary}
                    >
                      <OsdsText
                        size={ODS_THEME_TYPOGRAPHY_SIZE._500}
                        color={ODS_THEME_COLOR_INTENT.text}
                        slot={'end'}
                      >
                        {DOWNLOAD_FILETYPE.S3}
                      </OsdsText>
                    </OsdsRadioButton>
                  </OsdsRadio>
                </OsdsRadioGroup>
              </OsdsFormField>
              <OsdsFormField>
                <OsdsText
                  slot="label"
                  level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
                  color={ODS_THEME_COLOR_INTENT.text}
                >
                  {t(
                    'pci_projects_project_users_download-rclone_region_label_global',
                  )}
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
                <OsdsText
                  slot="helper"
                  color={ODS_THEME_COLOR_INTENT.text}
                  className={'mt-1'}
                >
                  {t('pci_projects_project_users_download-rclone_region_help')}
                </OsdsText>
              </OsdsFormField>
            </>
          )}
          {isLoadingDownload && (
            <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
          )}
        </slot>
        <OsdsButton
          slot="actions"
          color={ODS_THEME_COLOR_INTENT.primary}
          variant={ODS_BUTTON_VARIANT.ghost}
          onClick={onClose}
        >
          {t('pci_projects_project_users_download-rclone_cancel_label')}
        </OsdsButton>
        <OsdsButton
          slot="actions"
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={() => download(region, fileType)}
          {...(isLoadingDownload && { disabled: true })}
          data-testid="submitButton"
        >
          {t('pci_projects_project_users_download-rclone_submit_label')}
        </OsdsButton>
      </OsdsModal>
    </>
  );
}
