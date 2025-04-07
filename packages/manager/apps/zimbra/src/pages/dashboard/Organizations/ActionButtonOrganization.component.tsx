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
  const { t } = useTranslation('common');
  const { trackClick } = useOvhTracking();
  const { platformUrn } = usePlatform();
  const navigate = useNavigate();

  const hrefDeleteOrganization = useGenerateUrl(
    `./${organizationItem.id}/delete`,
    'path',
  );

  const handleDeleteOrganizationClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [DELETE_ORGANIZATION],
    });
    navigate(hrefDeleteOrganization);
  };

  const hrefEditOrganization = useGenerateUrl(
    `./${organizationItem.id}/edit`,
    'path',
  );

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
      label: t('modify'),
    },
    {
      id: 2,
      onClick: handleDeleteOrganizationClick,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.organization.delete],
      label: t('delete'),
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
