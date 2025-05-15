import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import { useNavigate } from 'react-router-dom';
import { ODS_BUTTON_COLOR, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { EmailAccountItem } from './EmailAccountsDatagrid.component';
import { usePlatform } from '@/data/hooks';
import { useGenerateUrl } from '@/hooks';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';
import { ResourceStatus } from '@/data/api';
import {
  DELETE_EMAIL_ACCOUNT,
  EDIT_EMAIL_ACCOUNT,
  GO_EMAIL_ACCOUNT_ALIASES,
} from '@/tracking.constants';

interface ActionButtonEmailAccountProps {
  item: EmailAccountItem;
}

export const ActionButtonEmailAccount: React.FC<ActionButtonEmailAccountProps> = ({
  item,
}) => {
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation('common');
  const { platformUrn } = usePlatform();
  const navigate = useNavigate();

  const hrefEditEmailAccount = useGenerateUrl(`./${item.id}/settings`, 'path');

  const handleEditEmailClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [EDIT_EMAIL_ACCOUNT],
    });
    navigate(hrefEditEmailAccount);
  };

  const hrefEmailAccountAliases = useGenerateUrl(
    `./${item.id}/aliases`,
    'path',
  );

  const handleEmailAliasesClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [GO_EMAIL_ACCOUNT_ALIASES],
    });
    navigate(hrefEmailAccountAliases);
  };

  const hrefDeleteEmailAccount = useGenerateUrl(`./${item.id}/delete`, 'path');

  const handleDeleteEmailClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [DELETE_EMAIL_ACCOUNT],
    });
    navigate(hrefDeleteEmailAccount);
  };

  const actionItems = [
    {
      id: 1,
      onClick: handleEditEmailClick,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.account.edit],
      label: t('modify'),
    },
    {
      id: 2,
      onClick: handleEmailAliasesClick,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.alias.get],
      label: t('alias'),
    },
    {
      id: 3,
      onClick: handleDeleteEmailClick,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.account.delete],
      label: t('delete'),
      color: ODS_BUTTON_COLOR.critical,
    },
  ];

  return (
    <ActionMenu
      id={item.id}
      isDisabled={item.status !== ResourceStatus.READY}
      items={actionItems}
      variant={ODS_BUTTON_VARIANT.ghost}
      isCompact
    />
  );
};

export default ActionButtonEmailAccount;
