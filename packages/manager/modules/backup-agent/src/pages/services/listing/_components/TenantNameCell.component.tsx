import { useHref } from 'react-router-dom';

import { DataGridTextCell, Links } from '@ovh-ux/manager-react-components';

import { subRoutes, urls } from '@/routes/routes.constants';
import { Resource } from '@/types/Resource.type';
import { Tenant } from '@/types/Tenant.type';
import { VSPCTenant } from '@/types/VspcTenant.type';

export const TenantNameCell = (tenant: Resource<Tenant | VSPCTenant>) => {
  const dashboardHref = useHref(urls.dashboardTenants.replace(subRoutes.dashboard, tenant.id));

  return (
    <DataGridTextCell>
      <Links href={dashboardHref} label={tenant.currentState.name} />
    </DataGridTextCell>
  );
};
