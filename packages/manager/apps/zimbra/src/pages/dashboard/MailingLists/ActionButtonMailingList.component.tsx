import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import { useGenerateUrl, usePlatform } from '@/hooks';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';
import { MailingListItem } from './MailingLists';
import { ResourceStatus } from '@/api/api.type';

interface ActionButtonMailingListProps {
  mailingListItem: MailingListItem;
}

const ActionButtonMailingList: React.FC<ActionButtonMailingListProps> = ({
  mailingListItem,
}) => {
  const { t } = useTranslation('mailinglists');
  const { platformUrn } = usePlatform();

  const hrefDeleteMailingList = useGenerateUrl('./delete', 'href', {
    deleteMailingListId: mailingListItem.id,
  });

  const handleDeleteMailingListClick = () => {
    window.location.href = hrefDeleteMailingList;
  };

  const hrefEditMailingList = useGenerateUrl('./settings', 'href', {
    editMailingListId: mailingListItem.id,
  });

  const handleEditMailingListClick = () => {
    window.location.href = hrefEditMailingList;
  };

  const hrefDefineMembersMailingList = useGenerateUrl(
    './define_members',
    'href',
    {
      mailingListId: mailingListItem.id,
    },
  );
  const handleDefineMembersMailingListClick = () => {
    window.location.href = hrefDefineMembersMailingList;
  };
  const hrefConfigureDelegationMailingList = useGenerateUrl(
    './configure_delegation',
    'href',
    {
      mailingListId: mailingListItem.id,
    },
  );

  const handleDefineConfigureDelegationMailingList = () => {
    window.location.href = hrefConfigureDelegationMailingList;
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
    },
  ];

  return (
    <ActionMenu
      id={mailingListItem.id}
      isDisabled={mailingListItem.status !== ResourceStatus.READY}
      items={actionItems}
      isCompact
    />
  );
};

export default ActionButtonMailingList;
