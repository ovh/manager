import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import { RegionDisplay } from '@/components/region/RegionDisplay.component';
import { Tenant } from '@/types/Tenant.type';

export const TenantLocationCell = (tenant: Tenant) => {
  return (
    <DataGridTextCell>
      <RegionDisplay id={tenant.currentState.vaults[0]?.azName ?? ''} displayKey="location" />
    </DataGridTextCell>
  );
};
