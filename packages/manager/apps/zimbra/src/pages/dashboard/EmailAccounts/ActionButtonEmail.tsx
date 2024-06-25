import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionMenu } from '@ovhcloud/manager-components';
import { EmailsItem } from './EmailAccounts';
import { useGenerateUrl, usePlatform } from '@/hooks';

interface ActionButtonEmailAccountProps {
  emailsItem: EmailsItem;
}

const ActionButtonEmail: React.FC<ActionButtonEmailAccountProps> = ({
  emailsItem,
}) => {
  const { t } = useTranslation('accounts');
  const { platformUrn } = usePlatform();

  const hrefEditEmailAccount = useGenerateUrl('./edit', 'href', {
    editEmailAccountId: emailsItem.id,
  });

  const hrefDeleteEmailAccount = useGenerateUrl('./delete', 'href', {
    deleteEmailAccountId: emailsItem.id,
  });
  const actionItems = [
    {
      id: 1,
      href: hrefEditEmailAccount,
      urn: platformUrn,
      iamActions: ['zimbra:apiovh:platform/account/edit'],
      label: t('zimbra_account_datagrid_tooltip_modification'),
    },
    {
      id: 2,
      href: hrefDeleteEmailAccount,
      urn: platformUrn,
      iamActions: ['zimbra:apiovh:platform/account/delete'],
      label: t('zimbra_account_datagrid_tooltip_delete'),
    },
  ];
  return <ActionMenu items={actionItems} isCompact />;
};

export default ActionButtonEmail;
