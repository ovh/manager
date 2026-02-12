import { ObservabilityServiceParams } from '@/data/api/observability.props';
import { GrafanaState } from '@/types/managedDashboards.type';
import { TIdentifier } from '@/types/observability.type';

export type TGrafanaTargetSpecPayload = Pick<
  GrafanaState,
  'title' | 'description' | 'datasource' | 'allowedNetworks' | 'release'
> & {
  infrastructure?: TIdentifier;
};

export type CreateGrafanaPayload = {
  targetSpec: TGrafanaTargetSpecPayload;
} & ObservabilityServiceParams;

export type GetGrafanaReleasesParams = {
  infrastructureId: string;
} & ObservabilityServiceParams;
