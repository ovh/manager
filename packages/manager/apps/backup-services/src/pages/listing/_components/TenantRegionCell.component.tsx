import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import { LocationDisplay } from '@/components/location/LocationDisplay.component';
import { Tenant } from '@/types/Tenant.type';

export const TenantRegionCell = (tenant: Tenant) => {
  return (
    <DataGridTextCell>
      <LocationDisplay id={tenant.currentState.vaults[0]?.azName ?? ''} displayKey="name" />
    </DataGridTextCell>
  );
};
