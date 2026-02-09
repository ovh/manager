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


export type GrafanaState = {
  title: string;
  description: string;
  endpoint?: string;
  infrastructure?: ManagedDashboardInfrastructure;
  datasource: ManagedDashboardDataSource;
  allowedNetworks?: string[];
  release: TIdentifier | GrafanaRelease;
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

export type GrafanaReleaseStatus = 'SUPPORTED' | 'DEPRECATED';

export type GrafanaReleaseMilestone = {
  id: string;
  status: GrafanaReleaseStatus;
  version: string;
};

export type GrafanaRelease = GrafanaReleaseMilestone & {
  upgradableTo?: GrafanaReleaseMilestone[];
  downgradableTo?: GrafanaReleaseMilestone[];
};

export type GrafanaReleasesResponse = {
  releases: GrafanaRelease[];
};
