import { InfrastructureSettings } from '@/types/infrastructures.type';
import { TIdentifier, TObservabilityResource } from '@/types/observability.type';

type TMetricLimits = {
  mimir: {
    compactor_blocks_retention_period: string;
    max_global_series_per_user: number;
  };
};

export type TenantInfrastructure = InfrastructureSettings & TIdentifier;

export type TenantState = {
  title: string;
  description?: string;
  limits?: TMetricLimits;
  infrastructure?: TenantInfrastructure;
};

export type Tenant = {
  currentState: TenantState;
  targetSpec?: TenantState;
} & TObservabilityResource;

export type TenantFormData = {
  title: string;
  description?: string;
  infrastructureId: string;
  retentionDuration: string;
  retentionUnit: string;
  maxSeries: number | null;
};

export type TenantListing = {
  name: string;
  endpoint: string | undefined;
  infrastructure: TenantInfrastructure | undefined;
  retention: string | undefined;
  numberOfSeries: number | undefined;
  tags: Record<string, string>;
  search: string;
} & TIdentifier;
