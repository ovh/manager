import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import { Tenant } from '@/types/Tenant.type';

export const TenantReferenceCell = (tenant: Tenant) => {
  return <DataGridTextCell>{tenant.id}</DataGridTextCell>;
};
