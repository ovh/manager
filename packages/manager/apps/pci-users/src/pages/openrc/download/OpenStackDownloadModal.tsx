import { PciModal, useGetProjectRegions } from '@ovh-ux/manager-pci-common';
import {
  Links,
  LinkType,
  useTranslatedMicroRegions,
} from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import {
  OsdsFormField,
  OsdsSelect,
  OsdsSelectOption,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OPENSTACK_GUIDE } from '@/download-openrc.constants';
import { useDownloadOpenStackConfig } from '@/api/hooks/useUser';
import { getOpenRcApiVersion } from '@/api/data/region';

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

  const { environment } = useContext(ShellContext);
  const { ovhSubsidiary } = environment.getUser();
  const region = environment.getRegion();

  const [currentRegion, setCurrentRegion] = useState('');
  const [openRCApiVersion, setOpenRCApiVersion] = useState(2);

  const { data: regions, isLoading } = useGetProjectRegions(`${projectId}`);
  const { translateMicroRegion } = useTranslatedMicroRegions();

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
    <PciModal
      title={t('pci_projects_project_users_download-openrc_title')}
      onCancel={onClose}
      onClose={onClose}
      onConfirm={() => downloadOpenStackConfig(currentRegion, openRCApiVersion)}
      isPending={isLoading || isLoadingDownload}
      isDisabled={isLoading || isLoadingDownload}
      submitText={t('pci_projects_project_users_download-openrc_submit_label')}
      cancelText={t('pci_projects_project_users_download-openrc_cancel_label')}
    >
      <OsdsText
        level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
        color={ODS_THEME_COLOR_INTENT.text}
        size={ODS_TEXT_SIZE._400}
      >
        {t('pci_projects_project_users_download-openrc_content')}
      </OsdsText>

      {openStackGuideURL && (
        <Links
          className="ml-3"
          href={openStackGuideURL}
          target={OdsHTMLAnchorElementTarget._blank}
          type={LinkType.external}
          label={t('pci_projects_project_users_download-openrc_more_link')}
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
              {translateMicroRegion(r.name)}
            </OsdsSelectOption>
          ))}
        </OsdsSelect>
        <OsdsText
          slot="helper"
          color={ODS_THEME_COLOR_INTENT.text}
          className="mt-2"
        >
          {t('pci_projects_project_users_download-openrc_info_global')}
        </OsdsText>
      </OsdsFormField>
    </PciModal>
  );
}
