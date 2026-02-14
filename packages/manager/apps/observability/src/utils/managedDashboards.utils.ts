import { DatasourceConfiguration } from '@/types/DatasourceConfiguration';
import { Grafana, GrafanaListing } from '@/types/managedDashboards.type';

export const mapGrafanaToListing = (grafanas: Grafana[]): GrafanaListing[] => {
  const result: GrafanaListing[] = grafanas.map(
    ({ id, currentState, resourceStatus, iam, updatedAt }) => {
      const { title, description, endpoint, infrastructure, datasource, version } = currentState;
      const entryPoint = infrastructure?.entryPoint;
      const configuration = datasource.fullySynced
        ? DatasourceConfiguration.AUTOMATIC
        : DatasourceConfiguration.MANUAL;
      const isAccessLimited = !!infrastructure?.publicIpAddress;
      const versionValue = version.value;
      const deprecated = version.deprecated;
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
