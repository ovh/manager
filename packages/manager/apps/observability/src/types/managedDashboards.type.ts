import { CertificationLevel } from '@/types/CertificationLevel.enum';
import { DatasourceConfiguration } from '@/types/DatasourceConfiguration';
import { InfrastructureSettings } from '@/types/infrastructures.type';
import { TIdentifier, TObservabilityResource } from '@/types/observability.type';
import { ResourceStatus } from '@/types/resource.type';

export type ManagedDashboardInfrastructure = InfrastructureSettings &
  TIdentifier & {
    certificationLevel: CertificationLevel;
  };

export type ManagedDashboardDataSource = {
  fullySynced: boolean;
};

export type ManagedDashboardVersion = {
  value: string;
  deprecated: boolean;
};

export type GrafanaState = {
  title: string;
  description: string;
  endpoint?: string;
  infrastructure?: ManagedDashboardInfrastructure;
  datasource: ManagedDashboardDataSource;
  version: ManagedDashboardVersion;
};

export type Grafana = {
  currentState: GrafanaState;
  targetSpec?: GrafanaState;
  resourceStatus: ResourceStatus;
} & TObservabilityResource;

export type GrafanaListing = {
  name: string;
  description: string | undefined;
  resourceStatus: ResourceStatus;
  endpoint: string | undefined;
  entryPoint: string | undefined;
  infrastructure: ManagedDashboardInfrastructure | undefined;
  configuration: DatasourceConfiguration;
  version: string;
  deprecated: boolean;
  isAccessLimited: boolean;
  urn: string | undefined;
  updatedAt: string | null;
  search: string;
} & TIdentifier;
