import { useHref } from 'react-router-dom';

import { Link, TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { DataGridCellLinkProps } from '@/components/listing/common/datagrid-cells/datagrid-cell-link/DataGridCellLink.props';
import { getTenantDashboardUrl } from '@/routes/Routes.utils';

export default function DatagridCellLink({ id, label }: DataGridCellLinkProps) {
  const href = useHref(getTenantDashboardUrl(id));

  return (
    <div className="flex flex-col">
      <Link data-testid={`cell-link-${id}`} href={href}>
        {label}
      </Link>
      <Text preset={TEXT_PRESET.small}>{id}</Text>
    </div>
  );
}
