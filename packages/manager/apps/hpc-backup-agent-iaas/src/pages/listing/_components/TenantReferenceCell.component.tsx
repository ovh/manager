import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import { Tenant } from '@/types/Tenant.type';
import { VSPCTenant } from '@/types/VspcTenant.type';

export const TenantReferenceCell = (tenant: Tenant | VSPCTenant) => {
  return <DataGridTextCell>{tenant.id}</DataGridTextCell>;
};
