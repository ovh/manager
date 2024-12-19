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
import { OrganizationItem } from './Organizations';
import { useGenerateUrl, usePlatform } from '@/hooks';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';
import { ResourceStatus } from '@/api/api.type';
import { DELETE_ORGANIZATION, EDIT_ORGANIZATION } from '@/tracking.constant';

interface ActionButtonOrganizationProps {
  organizationItem: OrganizationItem;
}

const ActionButtonOrganization: React.FC<ActionButtonOrganizationProps> = ({
  organizationItem,
}) => {
  const { t } = useTranslation('organizations');
  const { trackClick } = useOvhTracking();
  const { platformUrn } = usePlatform();
  const navigate = useNavigate();

  const hrefDeleteOrganization = useGenerateUrl('./delete', 'path', {
    deleteOrganizationId: organizationItem.id,
  });

  const handleDeleteOrganizationClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [DELETE_ORGANIZATION],
    });
    navigate(hrefDeleteOrganization);
  };

  const hrefEditOrganization = useGenerateUrl('./edit', 'path', {
    editOrganizationId: organizationItem.id,
  });

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
      label: t('zimbra_organization_edit'),
    },
    {
      id: 2,
      onClick: handleDeleteOrganizationClick,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.organization.delete],
      label: t('zimbra_organization_delete'),
      color: ODS_BUTTON_COLOR.critical,
    },
  ];

  return (
    <ActionMenu
      id={organizationItem.id}
      isDisabled={organizationItem.status !== ResourceStatus.READY}
      items={actionItems}
      variant={ODS_BUTTON_VARIANT.ghost}
      isCompact
    />
  );
};

export default ActionButtonOrganization;
