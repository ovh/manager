import { getMetricKind, getMetricKinds } from '@/__mocks__/metrics/metric.mock';
import { ChartWidget } from '@/components/widget/ChartWidget.type';
import { ObservabilityDashboardParams } from '@/types/ClientApi.type';
import { Dashboard, Kind } from '@/types/observability.type';

export const getPredefinedDashboard = async ({
  resourceName,
  productType,
}: ObservabilityDashboardParams): Promise<Dashboard> => {
  console.info(
    `[MOCK-ADAPTER][getPredefinedDashboard] mock for service ${resourceName} and PU ${productType} -> `,
  );

  const kinds = await getMetricKinds({
    resourceName,
    productType,
  });

  const charts: ChartWidget[] = await Promise.all(
    kinds.map(async (kindName: string) => {
      const kind: Kind = await getMetricKind({
        resourceName,
        kindName,
      });
      return kind?.currentState?.chart;
    }),
  );

  return {
    id: '1',
    currentState: charts,
    createdAt: '2025-11-21T14:26:14.041Z',
    updatedAt: '2025-11-21T14:26:14.041Z',
  };
};
