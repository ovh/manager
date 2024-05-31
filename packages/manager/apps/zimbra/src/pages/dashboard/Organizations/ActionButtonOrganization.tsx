import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';
import { ActionMenu } from '@ovhcloud/manager-components';
import { OrganizationItem } from './Organizations';

interface ActionButtonOrganizationProps {
  organizationItem: OrganizationItem;
}

export const ActionButtonOrganization: React.FC<ActionButtonOrganizationProps> = ({
  organizationItem,
}) => {
  const { t } = useTranslation('organisations');
  const hrefDeleteOrganization = useHref(
    `./delete?deleteOrganizationId=${organizationItem.id}`,
  );

  const actionItems = [
    {
      id: 1,
      href: 'https://ovhcloud.com',
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
