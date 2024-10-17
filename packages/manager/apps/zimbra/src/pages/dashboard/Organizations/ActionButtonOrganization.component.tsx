import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionMenu } from '@ovh-ux/manager-react-components';
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

  const hrefDeleteOrganization = useGenerateUrl('./delete', 'href', {
    deleteOrganizationId: organizationItem.id,
  });

  const handleDeleteOrganizationClick = () => {
    window.location.href = hrefDeleteOrganization;
  };

  const hrefEditOrganization = useGenerateUrl('./edit', 'href', {
    editOrganizationId: organizationItem.id,
  });

  const handleEditOrganizationClick = () => {
    window.location.href = hrefEditOrganization;
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
