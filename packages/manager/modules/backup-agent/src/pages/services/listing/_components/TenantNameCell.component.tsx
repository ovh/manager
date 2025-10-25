import { useHref } from 'react-router-dom';

import { DataGridTextCell, Links } from '@ovh-ux/manager-react-components';

import { subRoutes, urls } from '@/routes/Routes.constants';
import { Tenant } from '@/types/Tenant.type';

export const TenantNameCell = (tenant: Tenant) => {
  const dashboardHref = useHref(urls.dashboard.replace(subRoutes.dashboard, tenant.id));

  return (
    <DataGridTextCell>
      <Links href={dashboardHref} label={tenant.currentState.name} />
    </DataGridTextCell>
  );
};
