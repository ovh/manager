import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import { useNavigate } from 'react-router-dom';
import { OrganizationItem } from './Organizations';
import { useGenerateUrl, usePlatform } from '@/hooks';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';
import { ResourceStatus } from '@/api/api.type';

interface ActionButtonOrganizationProps {
  organizationItem: OrganizationItem;
}

const ActionButtonOrganization: React.FC<ActionButtonOrganizationProps> = ({
  organizationItem,
}) => {
  const { t } = useTranslation('organizations');
  const { platformUrn } = usePlatform();
  const navigate = useNavigate();

  const hrefDeleteOrganization = useGenerateUrl('./delete', 'path', {
    deleteOrganizationId: organizationItem.id,
  });

  const handleDeleteOrganizationClick = () => {
    navigate(hrefDeleteOrganization);
  };

  const hrefEditOrganization = useGenerateUrl('./edit', 'path', {
    editOrganizationId: organizationItem.id,
  });

  const handleEditOrganizationClick = () => {
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
    },
  ];

  return (
    <ActionMenu
      id={organizationItem.id}
      isDisabled={organizationItem.status !== ResourceStatus.READY}
      items={actionItems}
      isCompact
    />
  );
};

export default ActionButtonOrganization;
