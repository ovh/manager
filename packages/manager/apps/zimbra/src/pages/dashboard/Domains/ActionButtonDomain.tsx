import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionMenu } from '@ovhcloud/manager-components';

const ActionButtonDomain: React.FC = () => {
  const { t } = useTranslation('domains');
  const actionItems = [
    {
      id: 1,
      onClick: () => window.open('https://ovhcloud.com', '_blank', 'noopener'),
      label: t('zimbra_domains_tooltip_configure'),
    },
    {
      id: 2,
      onClick: () => window.open('https://ovhcloud.com', '_blank', 'noopener'),
      label: t('zimbra_domains_tooltip_delete'),
    },
  ];
  return <ActionMenu items={actionItems} isCompact />;
};

export default ActionButtonDomain;
