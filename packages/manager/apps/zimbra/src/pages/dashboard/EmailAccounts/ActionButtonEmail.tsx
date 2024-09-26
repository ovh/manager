import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import { EmailsItem } from './EmailAccounts';
import { useGenerateUrl, usePlatform } from '@/hooks';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';
import { ResourceStatus } from '@/api/api.type';

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
      iamActions: [IAM_ACTIONS.account.edit],
      label: t('zimbra_account_datagrid_tooltip_modification'),
    },
    {
      id: 2,
      href: hrefDeleteEmailAccount,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.account.delete],
      label: t('zimbra_account_datagrid_tooltip_delete'),
    },
  ];
  return (
    <ActionMenu
      disabled={emailsItem.status !== ResourceStatus.READY}
      items={actionItems}
      isCompact
    />
  );
};

export default ActionButtonEmail;
