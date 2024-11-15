import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import { useNavigate } from 'react-router-dom';
import { ODS_BUTTON_COLOR, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
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
  const navigate = useNavigate();

  const hrefDeleteMailingList = useGenerateUrl('./delete', 'path', {
    deleteMailingListId: mailingListItem.id,
  });

  const handleDeleteMailingListClick = () => {
    navigate(hrefDeleteMailingList);
  };

  const hrefEditMailingList = useGenerateUrl('./settings', 'path', {
    editMailingListId: mailingListItem.id,
  });

  const handleEditMailingListClick = () => {
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
