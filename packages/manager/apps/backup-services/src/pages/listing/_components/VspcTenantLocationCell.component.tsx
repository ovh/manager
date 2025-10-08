import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import { LocationDisplay } from '@/components/location/LocationDisplay.component';
import { VSPCTenant } from '@/types/VspcTenant.type';

export const VSPCTenantLocationCell = (tenant: VSPCTenant) => {
  return (
    <DataGridTextCell>
      <LocationDisplay id={tenant.currentState.azName ?? ''} displayKey="location" />
    </DataGridTextCell>
  );
};
