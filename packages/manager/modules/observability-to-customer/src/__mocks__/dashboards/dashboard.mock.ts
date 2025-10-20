import { getDataset } from '../../__datasets__/datasetsUtils';
import { ChartWidget } from '../../components/widget/ChartWidget.type';
import { ObservabilityDashboardParams } from '../../types/ClientApi.type';
import { Dashboard } from '../../types/observability.type';

export const getPredefinedDashboard = async ({
  serviceName,
  productType,
}: ObservabilityDashboardParams): Promise<Dashboard> => {
  console.info(
    `[MOCK-ADAPTER][getPredefinedDashboard] mock for service ${serviceName} and PU ${productType} -> `,
  );

  const charts: ChartWidget[] = getDataset('dashboards', productType);

  return Promise.resolve({
    id: '1',
    currentState: charts,
  });
};
