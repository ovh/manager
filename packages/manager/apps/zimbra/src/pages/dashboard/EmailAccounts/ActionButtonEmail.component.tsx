import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import { useNavigate } from 'react-router-dom';
import { ODS_BUTTON_COLOR, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
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
  const navigate = useNavigate();

  const hrefEditEmailAccount = useGenerateUrl('./settings', 'path', {
    editEmailAccountId: emailsItem.id,
  });

  const handleEditEmailClick = () => {
    navigate(hrefEditEmailAccount);
  };

  const hrefDeleteEmailAccount = useGenerateUrl('./delete', 'path', {
    deleteEmailAccountId: emailsItem.id,
  });

  const handleDeleteEmailClick = () => {
    navigate(hrefDeleteEmailAccount);
  };

  const actionItems = [
    {
      id: 1,
      onClick: handleEditEmailClick,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.account.edit],
      label: t('zimbra_account_datagrid_tooltip_modification'),
    },
    {
      id: 2,
      onClick: handleDeleteEmailClick,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.account.delete],
      label: t('zimbra_account_datagrid_tooltip_delete'),
      color: ODS_BUTTON_COLOR.critical,
    },
  ];

  return (
    <ActionMenu
      id={emailsItem.id}
      isDisabled={emailsItem.status !== ResourceStatus.READY}
      items={actionItems}
      variant={ODS_BUTTON_VARIANT.ghost}
      isCompact
    />
  );
};

export default ActionButtonEmail;
