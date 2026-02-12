import { apiClient } from '@ovh-ux/manager-core-api';

import { CreateGrafanaPayload, GetGrafanaReleasesParams } from '@/data/api/grafana.props';
import { ObservabilityServiceParams } from '@/data/api/observability.props';
import { Grafana, GrafanaReleasesResponse } from '@/types/managedDashboards.type';

export const getGrafanas = async ({
  resourceName,
  signal,
}: ObservabilityServiceParams): Promise<Grafana[]> => {
  const { data } = await apiClient.v2.get<Grafana[]>(
    `/observability/resource/${resourceName}/setting/grafana`,
    {
      signal,
    },
  );
  return data;
};

export const getGrafanaReleases = async ({
  resourceName,
  infrastructureId,
  signal,
}: GetGrafanaReleasesParams): Promise<GrafanaReleasesResponse> => {
  const { data } = await apiClient.v2.get<GrafanaReleasesResponse>(
    `/observability/resource/${resourceName}/infrastructure/${infrastructureId}/grafana/release`,
    // TODO: check URL when available
    {
      signal,
    },
  );
  return data;
};

export const createGrafana = async ({
  resourceName,
  targetSpec,
  signal,
}: CreateGrafanaPayload): Promise<Grafana> => {
  const { data } = await apiClient.v2.post<Grafana>(
    `/observability/resource/${resourceName}/setting/grafana`,
    { targetSpec },
    { signal },
  );
  return data;
};
