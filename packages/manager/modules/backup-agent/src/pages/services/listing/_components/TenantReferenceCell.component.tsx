import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import { Resource } from '@/types/Resource.type';
import { Tenant } from '@/types/Tenant.type';
import { VSPCTenant } from '@/types/VspcTenant.type';

export const TenantReferenceCell = (tenant: Resource<Tenant | VSPCTenant>) => {
  return <DataGridTextCell>{tenant.id}</DataGridTextCell>;
};
