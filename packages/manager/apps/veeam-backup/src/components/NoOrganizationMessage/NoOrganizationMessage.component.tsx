import React from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_MESSAGE_TYPE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { VCDOrganization } from '@ovh-ux/manager-module-vcd-api';
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
        <OsdsText
          level={ODS_TEXT_LEVEL.body}
          size={ODS_TEXT_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('no_organization_message')}{' '}
          <VCDOrgInfoLink label={t('no_organization_link')} />
        </OsdsText>
      </OsdsMessage>
    )
  );
};
