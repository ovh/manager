import {
  OsdsButton,
  OsdsFormField,
  OsdsIcon,
  OsdsLink,
  OsdsModal,
  OsdsSelect,
  OsdsSelectOption,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { useEnvironment } from '@ovh-ux/manager-react-shell-client';
import { useEffect, useState } from 'react';
import { useDownloadOpenStackConfig } from '@/api/hooks/useUser';
import { OPENSTACK_GUIDE } from '@/download-openrc.constants';
import { useAllRegions } from '@/api/hooks/useRegion';
import { getMacroRegion, getOpenRcApiVersion } from '@/api/data/region';

interface OpenStackDownloadModalProps {
  projectId: string;
  userId: string;
  onClose: () => void;
  onSuccess: (content: string) => void;
  onError: (cause: Error) => void;
}

export default function OpenStackDownloadModal({
  projectId,
  userId,
  onClose,
  onSuccess,
  onError,
}: OpenStackDownloadModalProps) {
  const { t } = useTranslation('common');
  const { t: tRegion } = useTranslation('region');
  const { ovhSubsidiary } = useEnvironment().getUser();
  const region = useEnvironment().getRegion();
  const [currentRegion, setCurrentRegion] = useState('');
  const { data: regions, isLoading } = useAllRegions(`${projectId}`);
  const [openRCApiVersion, setOpenRCApiVersion] = useState(2);
  const {
    download: downloadOpenStackConfig,
    isLoading: isLoadingDownload,
  } = useDownloadOpenStackConfig({
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
  const openStackGuideURL = OPENSTACK_GUIDE[region][ovhSubsidiary];
  useEffect(() => {
    if (regions?.length) {
      setOpenRCApiVersion(getOpenRcApiVersion(regions, region));
      setCurrentRegion(regions[0].name);
    }
  }, [regions]);

  return (
    <OsdsModal
      headline={t('pci_projects_project_users_download-openrc_title')}
      onOdsModalClose={onClose}
    >
      <slot name="content">
        {!isLoading && !isLoadingDownload && (
          <>
            <OsdsText
              slot="label"
              level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {t('pci_projects_project_users_download-openrc_content')}
            </OsdsText>
            {openStackGuideURL && (
              <OsdsLink
                href={openStackGuideURL}
                className={'align-text-bottom ml-1'}
                color={ODS_THEME_COLOR_INTENT.primary}
                target={OdsHTMLAnchorElementTarget._blank}
              >
                <span slot={'start'}>
                  <OsdsText
                    size={ODS_THEME_TYPOGRAPHY_SIZE._500}
                    color={ODS_THEME_COLOR_INTENT.primary}
                  >
                    {t('pci_projects_project_users_download-openrc_more_link')}
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
                level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {t('pci_projects_project_users_download-openrc_region_label')}
              </OsdsText>
              <OsdsSelect
                value={currentRegion}
                onOdsValueChange={(event) => {
                  setCurrentRegion(`${event.detail.value}`);
                }}
              >
                {regions?.map((r, index) => (
                  <OsdsSelectOption key={index} value={r.name}>
                    {tRegion(
                      `manager_components_region_${getMacroRegion(
                        r.datacenterLocation,
                      )}_micro`,
                      {
                        micro: r.name,
                      },
                    )}
                  </OsdsSelectOption>
                ))}
              </OsdsSelect>
              <OsdsText
                level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
                color={ODS_THEME_COLOR_INTENT.text}
                className={'mt-4'}
              >
                {t('pci_projects_project_users_download-openrc_info_global')}
              </OsdsText>
            </OsdsFormField>
          </>
        )}
        {isLoading ||
          (isLoadingDownload && (
            <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
          ))}
      </slot>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.ghost}
        onClick={onClose}
      >
        {t('pci_projects_project_users_download-openrc_cancel_label')}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={() => downloadOpenStackConfig(currentRegion, openRCApiVersion)}
        {...(isLoading && isLoadingDownload ? { disabled: true } : {})}
        data-testid="submitButton"
      >
        {t('pci_projects_project_users_download-openrc_submit_label')}
      </OsdsButton>
    </OsdsModal>
  );
}
