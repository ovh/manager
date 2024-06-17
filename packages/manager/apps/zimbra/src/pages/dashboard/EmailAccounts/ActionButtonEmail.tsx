import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionMenu } from '@ovhcloud/manager-components';
import { EmailsItem } from './EmailAccounts';
import { useGenerateUrl } from '@/hooks';

interface ActionButtonEmailAccountProps {
  emailsItem: EmailsItem;
}

const ActionButtonEmail: React.FC<ActionButtonEmailAccountProps> = ({
  emailsItem,
}) => {
  const { t } = useTranslation('emails');

  const hrefDeleteEmailAccount = useGenerateUrl('./delete', 'href', {
    deleteEmailAccountId: emailsItem.id,
  });
  const actionItems = [
    {
      id: 1,
      onClick: () => window.open('https://ovhcloud.com', '_blank', 'noopener'),
      label: t('zimbra_emails_datagrid_tooltip_modification'),
    },
    {
      id: 2,
      href: hrefDeleteEmailAccount,
      label: t('zimbra_emails_datagrid_tooltip_delete'),
    },
  ];
  return <ActionMenu items={actionItems} isCompact />;
};

export default ActionButtonEmail;
