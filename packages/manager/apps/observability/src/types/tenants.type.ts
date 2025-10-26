import { Infrastructure, Retention } from '@/types/infrastructures.type';
import { TObservabilityResource } from '@/types/observability.type';

type TMetricLimits = {
  numberOfSeries: {
    current: number;
    maximum: number;
  };
  retention?: Retention;
};

export type TenantState = {
  title: string;
  description?: string;
  limits?: TMetricLimits;
  infrastructure?: Infrastructure;
  tags?: string[];
};

export type Tenant = {
  currentState: TenantState;
  targetSpec?: TenantState;
} & TObservabilityResource;

export type TenantFormData = {
  title: string;
  description?: string;
  infrastructureId: string;
  retentionId: string;
  maxSeries: number | null;
};
