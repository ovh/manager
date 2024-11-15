import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ODS_BUTTON_COLOR, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { AliasItem } from './EmailAccountsAlias.page';
import { useGenerateUrl, usePlatform } from '@/hooks';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';
import { ResourceStatus } from '@/api/api.type';

interface ActionButtonAliasAccountProps {
  aliasItem: AliasItem;
}

const ActionButtonAlias: React.FC<ActionButtonAliasAccountProps> = ({
  aliasItem,
}) => {
  const { t } = useTranslation('accounts/alias');
  const { platformUrn } = usePlatform();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editEmailAccountId = searchParams.get('editEmailAccountId');

  const hrefDeleteAlias = useGenerateUrl('./delete', 'path', {
    deleteAliasId: aliasItem.id,
    editEmailAccountId,
  });

  const handleDeleteAliasClick = () => {
    navigate(hrefDeleteAlias);
  };

  const actionItems = [
    {
      id: 1,
      onClick: handleDeleteAliasClick,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.alias.delete],
      label: t('zimbra_account_alias_datagrid_tooltip_delete'),
      color: ODS_BUTTON_COLOR.critical,
    },
  ];

  return (
    <ActionMenu
      id={aliasItem.id}
      isDisabled={aliasItem.status !== ResourceStatus.READY}
      items={actionItems}
      variant={ODS_BUTTON_VARIANT.ghost}
      isCompact
    />
  );
};

export default ActionButtonAlias;
