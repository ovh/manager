import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionMenu } from '@ovhcloud/manager-components';
import { useHref } from 'react-router-dom';
import { EmailsItem } from './EmailAccounts';
import { useOrganization } from '@/hooks';

interface ActionButtonEmailAccountProps {
  emailsItem: EmailsItem;
}

const ActionButtonEmail: React.FC<ActionButtonEmailAccountProps> = ({
  emailsItem,
}) => {
  const { t } = useTranslation('emails');
  const { data: organization } = useOrganization();

  const hrefDeleteEmailAccount = useHref(
    `./delete?deleteEmailAccountId=${emailsItem.id}${
      organization?.id ? `&organizationId=${organization.id}` : ''
    }`,
  );

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
