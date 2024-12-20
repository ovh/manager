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
import { useGenerateUrl, usePlatform } from '@/hooks';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';
import { MailingListItem } from './MailingLists';
import { ResourceStatus } from '@/api/api.type';
import {
  CONFIGURE_DELEGATION_MAILING_LIST,
  DEFINE_MEMBERS_MAILING_LIST,
  DELETE_MAILING_LIST,
  EDIT_MAILING_LIST,
} from '@/tracking.constant';

interface ActionButtonMailingListProps {
  mailingListItem: MailingListItem;
}

const ActionButtonMailingList: React.FC<ActionButtonMailingListProps> = ({
  mailingListItem,
}) => {
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation('mailinglists');
  const { platformUrn } = usePlatform();
  const navigate = useNavigate();

  const hrefDeleteMailingList = useGenerateUrl('./delete', 'path', {
    deleteMailingListId: mailingListItem.id,
  });

  const handleDeleteMailingListClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [DELETE_MAILING_LIST],
    });
    navigate(hrefDeleteMailingList);
  };

  const hrefEditMailingList = useGenerateUrl('./settings', 'path', {
    editMailingListId: mailingListItem.id,
  });

  const handleEditMailingListClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [EDIT_MAILING_LIST],
    });
    navigate(hrefEditMailingList);
  };

  const hrefDefineMembersMailingList = useGenerateUrl(
    './define_members',
    'path',
    {
      mailingListId: mailingListItem.id,
    },
  );

  const handleDefineMembersMailingListClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [DEFINE_MEMBERS_MAILING_LIST],
    });
    navigate(hrefDefineMembersMailingList);
  };

  const hrefConfigureDelegationMailingList = useGenerateUrl(
    './configure_delegation',
    'path',
    {
      mailingListId: mailingListItem.id,
    },
  );

  const handleDefineConfigureDelegationMailingList = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [CONFIGURE_DELEGATION_MAILING_LIST],
    });
    navigate(hrefConfigureDelegationMailingList);
  };

  const actionItems = [
    {
      id: 1,
      onClick: handleEditMailingListClick,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.mailingList.edit],
      label: t('zimbra_mailinglists_datagrid_action_edit'),
    },
    {
      id: 2,
      onClick: handleDefineMembersMailingListClick,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.mailingList.edit],
      label: t('zimbra_mailinglists_datagrid_action_define_members'),
    },
    {
      id: 3,
      onClick: handleDefineConfigureDelegationMailingList,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.mailingList.edit],
      label: t('zimbra_mailinglists_datagrid_action_configure_delegation'),
    },
    {
      id: 4,
      onClick: handleDeleteMailingListClick,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.mailingList.delete],
      label: t('zimbra_mailinglists_datagrid_action_delete'),
      color: ODS_BUTTON_COLOR.critical,
    },
  ];

  return (
    <ActionMenu
      id={mailingListItem.id}
      isDisabled={mailingListItem.status !== ResourceStatus.READY}
      items={actionItems}
      variant={ODS_BUTTON_VARIANT.ghost}
      isCompact
    />
  );
};

export default ActionButtonMailingList;
