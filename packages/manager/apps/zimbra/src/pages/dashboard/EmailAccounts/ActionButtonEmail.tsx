import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionMenu } from '@ovhcloud/manager-components';

const ActionButtonEmail: React.FC = () => {
  const { t } = useTranslation('emails');
  const actionItems = [
    {
      id: 1,
      onClick: () => window.open('https://ovhcloud.com', '_blank', 'noopener'),
      label: t('zimbra_emails_datagrid_tooltip_modification'),
    },
    {
      id: 2,
      onClick: () => window.open('https://ovhcloud.com', '_blank', 'noopener'),
      label: t('zimbra_emails_datagrid_tooltip_delete'),
    },
  ];
  return <ActionMenu items={actionItems} isCompact />;
};

export default ActionButtonEmail;
