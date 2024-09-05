import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import { OrganizationItem } from './Organizations';
import { useGenerateUrl, usePlatform } from '@/hooks';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';

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

  const hrefEditOrganization = useGenerateUrl('./edit', 'href', {
    editOrganizationId: organizationItem.id,
  });
  const actionItems = [
    {
      id: 1,
      href: hrefEditOrganization,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.organization.edit],
      label: t('zimbra_organization_edit'),
    },
    {
      id: 2,
      href: hrefDeleteOrganization,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.organization.delete],
      label: t('zimbra_organization_delete'),
    },
  ];

  return <ActionMenu items={actionItems} isCompact />;
};

export default ActionButtonOrganization;
