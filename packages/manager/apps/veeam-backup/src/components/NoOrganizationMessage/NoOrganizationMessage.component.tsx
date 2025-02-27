import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsMessage } from '@ovhcloud/ods-components/react';
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
        <div className="flex flex-col">
          {t('no_organization_message')}
          <VCDOrgInfoLink label={t('no_organization_link')} />
        </div>
      </OdsMessage>
    )
  );
};
