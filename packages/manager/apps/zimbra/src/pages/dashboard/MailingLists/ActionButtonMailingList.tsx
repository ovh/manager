import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import { useGenerateUrl, usePlatform } from '@/hooks';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';
import { MailingListItem } from './MailingLists';

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

  const hrefEditMailingList = useGenerateUrl('./settings', 'href', {
    editMailingListId: mailingListItem.id,
  });

  const hrefDefineMembersMailingList = useGenerateUrl(
    './define_members',
    'href',
    {
      mailingListId: mailingListItem.id,
    },
  );

  const hrefConfigureDelegationMailingList = useGenerateUrl(
    './configure_delegation',
    'href',
    {
      mailingListId: mailingListItem.id,
    },
  );

  const actionItems = [
    {
      id: 1,
      href: hrefEditMailingList,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.mailingList.edit],
      label: t('zimbra_mailinglists_datagrid_action_edit'),
    },
    {
      id: 2,
      href: hrefDefineMembersMailingList,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.mailingList.edit],
      label: t('zimbra_mailinglists_datagrid_action_define_members'),
    },
    {
      id: 3,
      href: hrefConfigureDelegationMailingList,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.mailingList.edit],
      label: t('zimbra_mailinglists_datagrid_action_configure_delegation'),
    },
    {
      id: 4,
      href: hrefDeleteMailingList,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.mailingList.delete],
      label: t('zimbra_mailinglists_datagrid_action_delete'),
    },
  ];

  return <ActionMenu items={actionItems} isCompact />;
};

export default ActionButtonMailingList;
