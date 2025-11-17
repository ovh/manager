import { Location } from '@ovh-ux/shell';

import { TIdentifier } from './observability.type';

export type InfrastructureUsage = 'GRAFANA' | 'LOGS' | 'METRICS';
export type InfrastructureType = 'DEDICATED' | 'SHARED';
export type RegionType = 'LOCAL-ZONE' | 'REGION-1-AZ' | 'REGION-3-AZ';
export type RetentionType = 'LOGS_COLD_STORAGE' | 'LOGS_INDEXING' | 'METRICS_TENANT';

export type Retention = {
  duration: string;
  link?: string;
  default?: boolean;
  supported?: boolean;
} & TIdentifier;

export type Infrastructure = {
  currentState: {
    entryPoint: string;
    location: string;
    type: InfrastructureType;
    usage: InfrastructureUsage;
  };
  locationDetails?: Location;
} & TIdentifier;

export type InfrastructureWithLocation = Infrastructure & {
  locationDetails: NonNullable<Infrastructure['locationDetails']>;
};

export type GroupedInfrastructures = Record<string, InfrastructureWithLocation[]> & {
  all: InfrastructureWithLocation[];
};
