import { DatasourceConfiguration } from '@/types/DatasourceConfiguration';
import { Grafana, GrafanaListing, GrafanaRelease } from '@/types/managedDashboards.type';

export const mapGrafanaToListing = (grafanas: Grafana[]): GrafanaListing[] => {
  const result: GrafanaListing[] = grafanas.map(
    ({ id, currentState, resourceStatus, iam, updatedAt }) => {
      const { title, description, endpoint, infrastructure, datasource, allowedNetworks } =
        currentState;
      const release = currentState.release as GrafanaRelease;
      const entryPoint = infrastructure?.entryPoint;
      const configuration = datasource.fullySynced
        ? DatasourceConfiguration.AUTOMATIC
        : DatasourceConfiguration.MANUAL;
      const isAccessLimited = !!allowedNetworks?.length;
      const versionValue = release.version;
      const deprecated = release.status === 'DEPRECATED';
      const urn = iam?.urn;

      return {
        id,
        name: title,
        description,
        infrastructure,
        entryPoint,
        endpoint,
        configuration,
        version: versionValue,
        deprecated,
        isAccessLimited,
        resourceStatus,
        updatedAt,
        urn,
        search: `${title} ${description} ${entryPoint ?? ''}${configuration} ${versionValue}`,
      };
    },
  );

  return result;
};
