import React from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_COLOR, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { ResourceStatus } from '@/data/api';
import { usePlatform } from '@/data/hooks';
import { useGenerateUrl } from '@/hooks';
import {
  CONFIGURE_DELEGATION_MAILING_LIST,
  DEFINE_MEMBERS_MAILING_LIST,
  DELETE_MAILING_LIST,
  EDIT_MAILING_LIST,
} from '@/tracking.constants';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';

import { MailingListItem } from './MailingLists.types';

interface ActionButtonMailingListProps {
  item: MailingListItem;
}

export const ActionButtonMailingList: React.FC<ActionButtonMailingListProps> = ({ item }) => {
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation(['common', NAMESPACES.ACTIONS]);
  const { platformUrn } = usePlatform();
  const navigate = useNavigate();

  const hrefDeleteMailingList = useGenerateUrl(`./${item.id}/delete`, 'path');

  const handleDeleteMailingListClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [DELETE_MAILING_LIST],
    });
    navigate(hrefDeleteMailingList);
  };

  const hrefEditMailingList = useGenerateUrl(`./${item.id}/settings`, 'path');

  const handleEditMailingListClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [EDIT_MAILING_LIST],
    });
    navigate(hrefEditMailingList);
  };

  const hrefDefineMembersMailingList = useGenerateUrl(`./${item.id}/define_members`, 'path');

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
    `./${item.id}/configure_delegation`,
    'path',
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
      label: t('edit_mailing_list'),
    },
    {
      id: 2,
      onClick: handleDefineMembersMailingListClick,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.mailingList.edit],
      label: t('define_members_mailing_list'),
    },
    {
      id: 3,
      onClick: handleDefineConfigureDelegationMailingList,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.mailingList.edit],
      label: t('configure_delegation_mailing_list'),
    },
    {
      id: 4,
      onClick: handleDeleteMailingListClick,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.mailingList.delete],
      label: t(`${NAMESPACES.ACTIONS}:delete`),
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

export default ActionButtonMailingList;
