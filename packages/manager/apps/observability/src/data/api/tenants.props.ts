import { TIdentifier } from '@/types/observability.type';
import { TenantState } from '@/types/tenants.type';

import { ObservabilityServiceParams } from './observability.props';

export type TTargetSpecPayload = Omit<TenantState, 'limits' | 'infrastructure'> & {
  limits: {
    numberOfSeries: {
      maximum: number;
    };
    retention: TIdentifier;
  };
  infrastructure?: TIdentifier;
};

export type CreateTenantsPayload = {
  targetSpec: TTargetSpecPayload;
} & ObservabilityServiceParams;

export type GetTenantPayload = {
  tenantId: string;
} & ObservabilityServiceParams;
