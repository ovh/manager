import { TIdentifier } from '@/types/observability.type';
import { TenantState } from '@/types/tenants.type';

import { ObservabilityServiceParams } from './observability.props';

type TTargetSpecPayload = Omit<TenantState, 'limits'> & {
  limits: {
    numberOfSeries: {
      maximum: number;
    };
    retention: TIdentifier;
  };
};

export type CreateTenantsPayload = {
  targetSpec: TTargetSpecPayload;
} & ObservabilityServiceParams;
