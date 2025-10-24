import { Location } from '@ovh-ux/shell';

import { TIdentifier } from './observability.type';

export type InfrastructureUsage = 'GRAFANA' | 'LOGS' | 'METRICS';
export type InfrastructureType = 'DEDICATED' | 'SHARED';

export type Retention = {
  duration: string;
  link?: string;
  default?: boolean;
  supported?: boolean;
} & TIdentifier;

export type Infrastructure = {
  currentState: {
    location: string;
    type: InfrastructureType;
    usage: InfrastructureUsage;
  };
  locationDetails?: Location;
} & TIdentifier;
