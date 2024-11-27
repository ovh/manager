import React from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsMessage } from '@ovhcloud/ods-components/react';
import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { VCDOrganization } from '@/data';
import { VCDOrgInfoLink } from '../Links/VCDOrgInfoLink.component';

export type NoOrganizationMessageProps = {
  organizationList: VCDOrganization[];
};

export const NoOrganizationMessage: React.FC<NoOrganizationMessageProps> = ({
  organizationList,
}) => {
  const { t } = useTranslation('veeam-backup');

  return (
    organizationList.length === 0 && (
      <OsdsMessage
        type={ODS_MESSAGE_TYPE.warning}
        color={ODS_THEME_COLOR_INTENT.warning}
      >
        <div className="flex flex-col">
          <div>{t('no_organization_message')}</div>
          <VCDOrgInfoLink label={t('no_organization_link')} />
        </div>
      </OsdsMessage>
    )
  );
};
