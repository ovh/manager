import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { RancherService, RancherVersion } from '@/api/api.type';
import UpdateVersionBanner from '@/components/UpdateRancherVersionBanner/UpdateVersionBanner';

export interface DashboardMessagesProps {
  rancher: RancherService;
  editNameBannerType: ODS_MESSAGE_TYPE | null;
  versions: RancherVersion[];
  isPendingUpdate?: boolean;
  mutationGenerateAccessState?: any;
}

const DashboardMessages = ({
  rancher,
  editNameBannerType,
  mutationGenerateAccessState,
  isPendingUpdate,
  versions,
}: DashboardMessagesProps) => {
  const { t } = useTranslation('pci-rancher/dashboard');

  return (
    <>
      {editNameBannerType && (
        <OsdsMessage type={editNameBannerType} className="my-4 p-3">
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            className="inline-block"
          >
            {editNameBannerType === ODS_MESSAGE_TYPE.success
              ? t('editNameRancherSuccess')
              : t('editNameRancherError')}
          </OsdsText>
        </OsdsMessage>
      )}
      {mutationGenerateAccessState.length > 0 && (
        <OsdsMessage type={ODS_MESSAGE_TYPE.error} className="my-4 p-3">
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            className="inline-block"
          >
            {t('editNameRancherError')}
          </OsdsText>
        </OsdsMessage>
      )}
      <UpdateVersionBanner
        rancher={rancher}
        isPendingUpdateOperation={isPendingUpdate}
        versions={versions}
      />
    </>
  );
};

export default DashboardMessages;
