import { InfrastructureSettings } from '@/types/infrastructures.type';
import { TIdentifier, TObservabilityResource } from '@/types/observability.type';
import { Resource, ResourceStatus } from '@/types/resource.type';

type TMetricLimits = {
  mimir: {
    compactor_blocks_retention_period: string;
    max_global_series_per_user: number;
  };
};

export type TenantInfrastructure = InfrastructureSettings & TIdentifier;

export type TenantState = {
  title: string;
  description: string;
  limits?: TMetricLimits;
  endpoint?: string;
  infrastructure?: TenantInfrastructure;
};

export type Tenant = {
  currentState: TenantState;
  targetSpec?: TenantState;
  resourceStatus: ResourceStatus;
} & TObservabilityResource;

export type TenantFormData = {
  title: string;
  description: string;
  infrastructureId: string;
  retentionDuration: string;
  retentionUnit: string;
  maxSeries: number | null;
};

export type TenantListing = {
  name: string;
  resourceStatus: ResourceStatus;
  endpoint: string | undefined;
  entryPoint: string | undefined;
  infrastructure: TenantInfrastructure | undefined;
  retention: string | undefined;
  numberOfSeries: string | undefined;
  tags: { [key: string]: string };
  search: string;
} & TIdentifier;

export type TenantSubscription = {
  resourceStatus: ResourceStatus;
  currentState: {
    kind: string;
    link: string;
    resource: Resource;
  };
  targetSpec?: {
    kind: string;
    resource: Resource;
  };
} & TObservabilityResource;

export type TenantSubscriptionListing = {
  resourceStatus: ResourceStatus;
  resource: Resource;
  tags: { [key: string]: string };
  search: string;
  urn: string;
} & TIdentifier;
