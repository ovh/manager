import { useHref } from 'react-router-dom';

import { Link, TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { DataGridCellLinkProps } from '@/components/listing/common/datagrid/datagrid-cell-link/DataGridCellLink.props';
import { getTenantDashboardUrl } from '@/routes/Routes.utils';

export default function DatagridCellLink({ tenantId, resourceName, label }: DataGridCellLinkProps) {
  const href = useHref(getTenantDashboardUrl({ tenantId, resourceName }));

  return (
    <div className="flex flex-col">
      <Link data-testid={`cell-link-${tenantId}`} href={href}>
        {label}
      </Link>
      <Text preset={TEXT_PRESET.small}>{tenantId}</Text>
    </div>
  );
}
