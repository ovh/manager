import { useHref } from 'react-router-dom';

import { DataGridTextCell, Links } from '@ovh-ux/manager-react-components';

import { subRoutes, urls } from '@/routes/Routes.constants';
import { VSPCTenant } from '@/types/VspcTenant.type';

export const VSPCTenantNameCell = (tenant: VSPCTenant) => {
  const dashboardHref = useHref(
    urls.dashboard.replace(subRoutes.dashboard, tenant.currentState.companyName),
  );

  return (
    <DataGridTextCell>
      <Links href={dashboardHref} label={tenant.currentState.name} />
    </DataGridTextCell>
  );
};
