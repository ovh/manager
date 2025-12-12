import { Location } from '@ovh-ux/shell';

import { TIdentifier } from './observability.type';

export type InfrastructureUsage = 'GRAFANA' | 'LOGS' | 'METRICS';
export type InfrastructureType = 'DEDICATED' | 'SHARED';
export type RegionType = 'LOCAL-ZONE' | 'REGION-1-AZ' | 'REGION-3-AZ';
export type RetentionType = 'LOGS_COLD_STORAGE' | 'LOGS_INDEXING' | 'METRICS_TENANT';
export type InfrastructureExtraSettingsType = 'DURATION' | 'NUMERIC' | 'BOOLEAN' | 'STRING';

export type Retention = {
  duration: string;
  link?: string;
  default?: boolean;
  supported?: boolean;
} & TIdentifier;

export type InfraStructureExtraSettingsDuration = {
  default: string;
  max?: string;
  min?: string;
  type: InfrastructureExtraSettingsType;
};

export type InfraStructureExtraSettingsNumeric = {
  default: number;
  max?: number;
  min?: number;
  type: InfrastructureExtraSettingsType;
};

export type InfraStructureExtraSettings = {
  mimir: {
    configurable: {
      compactor_blocks_retention_period: InfraStructureExtraSettingsDuration;
      max_global_series_per_user: InfraStructureExtraSettingsNumeric;
    };
  };
};

export type InfrastructureSettings = {
  entryPoint: string;
  location: string;
  type: InfrastructureType;
  description?: string;
  publicIpAddress?: string;
};

export type Infrastructure = {
  currentState: InfrastructureSettings & {
    usage: InfrastructureUsage;
    extraSettings: InfraStructureExtraSettings;
  };
  locationDetails?: Location;
} & TIdentifier;

export type InfrastructureWithLocation = Infrastructure & {
  locationDetails: NonNullable<Infrastructure['locationDetails']>;
};

export type GroupedInfrastructures = Record<string, InfrastructureWithLocation[]> & {
  all: InfrastructureWithLocation[];
};
