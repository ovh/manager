import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionMenu } from '@ovhcloud/manager-components';
import { useSearchParams } from 'react-router-dom';
import { AliasItem } from './EmailAccountsAlias';
import { useGenerateUrl, usePlatform } from '@/hooks';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';

interface ActionButtonAliasAccountProps {
  aliasItem: AliasItem;
}

const ActionButtonAlias: React.FC<ActionButtonAliasAccountProps> = ({
  aliasItem,
}) => {
  const { t } = useTranslation('accounts/alias');
  const { platformUrn } = usePlatform();
  const [searchParams] = useSearchParams();
  const editEmailAccountId = searchParams.get('editEmailAccountId');

  const hrefDeleteAlias = useGenerateUrl('./delete', 'href', {
    deleteAliasId: aliasItem.id,
    editEmailAccountId,
  });
  const actionItems = [
    {
      id: 1,
      href: hrefDeleteAlias,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.alias.delete],
      label: t('zimbra_account_alias_datagrid_tooltip_delete'),
    },
  ];
  return <ActionMenu items={actionItems} isCompact />;
};

export default ActionButtonAlias;
