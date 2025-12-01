import { TIdentifier } from '@/types/observability.type';
import { TenantState } from '@/types/tenants.type';

import { ObservabilityServiceParams } from './observability.props';

export type TTargetSpecPayload = Omit<TenantState, 'limits' | 'infrastructure'> & {
  limits: {
    mimir: {
      compactor_blocks_retention_period: string;
      max_global_series_per_user: number | null;
    };
  };
  infrastructure?: TIdentifier;
};

export type CreateTenantsPayload = {
  targetSpec: TTargetSpecPayload;
} & ObservabilityServiceParams;

export type GetTenantPayload = {
  tenantId: string;
} & ObservabilityServiceParams;

export type EditTenantPayload = {
  tenantId: string;
  targetSpec: TTargetSpecPayload;
} & ObservabilityServiceParams;
