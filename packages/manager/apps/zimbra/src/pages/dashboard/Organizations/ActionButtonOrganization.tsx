import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionMenu } from '@ovhcloud/manager-components';
import { OrganizationItem } from './Organizations';
import { useGenerateUrl } from '@/hooks';

interface ActionButtonOrganizationProps {
  organizationItem: OrganizationItem;
}

export const ActionButtonOrganization: React.FC<ActionButtonOrganizationProps> = ({
  organizationItem,
}) => {
  const { t } = useTranslation('organisations');

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
      label: t('zimbra_organization_edit'),
    },
    {
      id: 2,
      href: hrefDeleteOrganization,
      label: t('zimbra_organization_delete'),
    },
  ];

  return <ActionMenu items={actionItems} isCompact />;
};
