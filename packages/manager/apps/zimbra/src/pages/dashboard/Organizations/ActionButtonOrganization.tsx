import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionMenu } from '@ovhcloud/manager-components';

export const ActionButtonOrganization: React.FC = () => {
  const { t } = useTranslation('organisations');
  const actionItems = [
    {
      id: 1,
      href: 'https://ovhcloud.com',
      label: t('zimbra_organization_edit'),
    },
    {
      id: 2,
      onClick: () => window.open('https://ovhcloud.com', '_blank', 'noopener'),
      label: t('zimbra_organization_delete'),
    },
  ];
  return <ActionMenu items={actionItems} isCompact />;
};

export default ActionButtonOrganization;
