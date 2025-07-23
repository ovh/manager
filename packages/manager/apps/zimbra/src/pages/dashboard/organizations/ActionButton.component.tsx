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
import { DELETE_ORGANIZATION, EDIT_ORGANIZATION } from '@/tracking.constants';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';

import { OrganizationItem } from './Organizations.types';

interface ActionButtonOrganizationProps {
  item: OrganizationItem;
}

export const ActionButtonOrganization: React.FC<ActionButtonOrganizationProps> = ({ item }) => {
  const { t } = useTranslation(['common', NAMESPACES.ACTIONS]);
  const { trackClick } = useOvhTracking();
  const { platformUrn } = usePlatform();
  const navigate = useNavigate();

  const hrefDeleteOrganization = useGenerateUrl(`./${item.id}/delete`, 'path');

  const handleDeleteOrganizationClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [DELETE_ORGANIZATION],
    });
    navigate(hrefDeleteOrganization);
  };

  const hrefEditOrganization = useGenerateUrl(`./${item.id}/edit`, 'path');

  const handleEditOrganizationClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [EDIT_ORGANIZATION],
    });
    navigate(hrefEditOrganization);
  };

  const actionItems = [
    {
      id: 1,
      onClick: handleEditOrganizationClick,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.organization.edit],
      label: t(`${NAMESPACES.ACTIONS}:modify`),
    },
    {
      id: 2,
      onClick: handleDeleteOrganizationClick,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.organization.delete],
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

export default ActionButtonOrganization;
