import { useHref } from 'react-router-dom';

import { DataGridTextCell, Links } from '@ovh-ux/manager-react-components';

import {subRoutes, urlParams, urls} from '@/routes/Routes.constants';
import { VSPCTenant } from '@/types/VspcTenant.type';

export const VSPCTenantNameCell = (tenant: VSPCTenant) => {
  const dashboardHref = useHref(
    urls.dashboardTenants.replace(urlParams.tenantId, tenant.currentState.companyName),
  );

  return (
    <DataGridTextCell>
      <Links href={dashboardHref} label={tenant.currentState.name} />
    </DataGridTextCell>
  );
};
