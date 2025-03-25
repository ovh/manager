import React from 'react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { Trans, useTranslation } from 'react-i18next';
import { OdsMessage, OdsText } from '@ovhcloud/ods-components/react';
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
      <OdsMessage color="warning">
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          <Trans
            t={t}
            i18nKey="no_organization_message"
            components={{
              ExternalLink: <VCDOrgInfoLink />,
            }}
          />
        </OdsText>
      </OdsMessage>
    )
  );
};
