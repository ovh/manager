import { useCallback, useMemo } from 'react';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useUsage } from '@/api/hooks/useUsage';
import {
  HOURLY_PRODUCTS,
  THourlyProduct,
  TResourceUsage,
  TUsageKind,
} from '@/api/data/usage';
import { roundNumber } from '@/pages/billing/estimate/utils';

const getTotalPrice = (products: { totalPrice: number }[]) => {
  const total = products.reduce((sum, { totalPrice }) => sum + totalPrice, 0);

  return roundNumber(total);
};

type TUsagePrices = {
  data: {
    totalHourlyPrice: number;
    totalMonthlyPrice: number;
    totalPrice: number;
  };
  isPending: boolean;
  error: ApiError;
};

export const useUsagePrice = (
  projectId: string,
  kind: TUsageKind,
): TUsagePrices => {
  const { data: usage, isPending: isUsagePending, error } = useUsage(
    projectId,
    kind,
  );

  const getResourcePrice = useCallback(
    (resourceUsage: TResourceUsage) =>
      getTotalPrice(
        usage?.resourcesUsage
          .find((r) => r.type === resourceUsage)
          ?.resources.map((r) => r.components)
          .flat(2) ?? [],
      ),
    [usage],
  );

  const getHourlyPrice = useCallback(
    (product: THourlyProduct) => {
      if (!usage?.hourlyUsage) return 0;
      const { hourlyUsage } = usage;
      switch (product) {
        case 'instance':
          return roundNumber(
            hourlyUsage.instance
              .map((s) => roundNumber(s.totalPrice))
              .reduce((sum, item) => roundNumber(sum + item), 0),
          );
        case 'snapshot':
          return roundNumber(
            hourlyUsage.snapshot
              .map((s) => roundNumber(s.totalPrice))
              .reduce((sum, item) => roundNumber(sum + item), 0),
          );
        case 'objectStorage':
          return roundNumber(
            hourlyUsage.storage
              .filter((s) => s.type !== 'pca')
              .map((s) => roundNumber(s.totalPrice))
              .reduce((sum, item) => roundNumber(sum + item), 0),
          );
        case 'archiveStorage':
          return roundNumber(
            hourlyUsage.storage
              .filter((s) => s.type === 'pca')
              .map((s) => roundNumber(s.totalPrice))
              .reduce((sum, item) => roundNumber(sum + item), 0),
          );
        case 'volume':
          return roundNumber(
            hourlyUsage.volume
              .map((s) => roundNumber(s.totalPrice))
              .reduce((sum, item) => roundNumber(sum + item), 0),
          );
        case 'bandwidth':
          return roundNumber(
            hourlyUsage.instanceBandwidth
              .map((b) => roundNumber(b.totalPrice))
              .reduce((sum, item) => roundNumber(sum + item), 0),
          );
        case 'privateRegistry':
          return getResourcePrice('registry');
        case 'kubernetesLoadBalancer':
          return getResourcePrice('loadbalancer');
        case 'notebooks':
          return getResourcePrice('ai-notebook');
        case 'serving':
          return getResourcePrice('ai-serving-engine');
        case 'training':
          return getResourcePrice('ai-training');
        case 'aiDeploy':
          return getResourcePrice('ai-app');
        case 'dataProcessing':
          return getResourcePrice('data-processing-job');
        case 'databases':
          return getResourcePrice('databases');
        case 'floatingIP':
          return getResourcePrice('floatingip');
        case 'gateway':
          return getResourcePrice('gateway');
        case 'octaviaLoadBalancer':
          return getResourcePrice('octavia-loadbalancer');
        case 'publicIP':
          return getResourcePrice('publicip');

        default:
          return 0;
      }
    },
    [usage],
  );

  const getMonthlyPrice = useCallback(
    () =>
      roundNumber(
        usage?.monthlyUsage.instance.reduce(
          (sum, { totalPrice }) => sum + roundNumber(totalPrice),
          0,
        ) ?? 0,
      ),
    [usage],
  );

  const totalHourlyPrice = roundNumber(
    HOURLY_PRODUCTS.map((product) => getHourlyPrice(product)).reduce(
      (sum, price) => roundNumber(sum + price),
      0,
    ),
  );

  const totalMonthlyPrice = roundNumber(getMonthlyPrice());

  const totalPrice = roundNumber(totalHourlyPrice + totalMonthlyPrice);

  return useMemo(
    () => ({
      data: {
        totalHourlyPrice,
        totalMonthlyPrice,
        totalPrice,
      },
      isPending: isUsagePending,
      error: error as ApiError,
    }),
    [usage, error],
  );
};
