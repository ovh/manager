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
import { EmailsItem } from './EmailAccounts';
import { useGenerateUrl, usePlatform } from '@/hooks';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';
import { ResourceStatus } from '@/api/api.type';
import { DELETE_EMAIL_ACCOUNT, EDIT_EMAIL_ACCOUNT } from '@/tracking.constant';

interface ActionButtonEmailAccountProps {
  emailsItem: EmailsItem;
}

const ActionButtonEmail: React.FC<ActionButtonEmailAccountProps> = ({
  emailsItem,
}) => {
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation('common');
  const { platformUrn } = usePlatform();
  const navigate = useNavigate();

  const hrefEditEmailAccount = useGenerateUrl(
    `./${emailsItem.id}/settings`,
    'path',
  );

  const handleEditEmailClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [EDIT_EMAIL_ACCOUNT],
    });
    navigate(hrefEditEmailAccount);
  };

  const hrefDeleteEmailAccount = useGenerateUrl(
    `./${emailsItem.id}/delete`,
    'path',
  );

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
      onClick: handleDeleteEmailClick,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.account.delete],
      label: t('delete'),
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
