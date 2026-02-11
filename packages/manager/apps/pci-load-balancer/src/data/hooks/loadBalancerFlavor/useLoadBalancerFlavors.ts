import { useQueries } from '@tanstack/react-query';

import { loadBalancerCatalogQueryKey } from '@/adapters/tanstack/loadBalancerCatalog/queryKeys';
import { loadBalancerFlavorsQueryKey } from '@/adapters/tanstack/loadBalancerFlavor/queryKeys';
import { productAvailabilityQueryKey } from '@/adapters/tanstack/productAvailability/queryKeys';
import { getLoadBalancerCatalog } from '@/data/api/loadBalancerCatalog.api';
import { getLoadBalancerFlavors } from '@/data/api/loadBalancerFlavor.api';
import { getLoadBalancerProductAvailability } from '@/data/api/loadBalancerProductAvailability.api';
import { TPrice } from '@/domain/entities/loadBalancerCatalog';
import { TLoadBalancerFlavor } from '@/domain/entities/loadBalancerFlavor';
import { mapFlavorSizeToLabel } from '@/domain/services/loadBalancer.service';

type TUseLoadBalancerFlavorsOptions<TData> = {
  projectId: string;
  region: string;
  ovhSubsidiary: string;
  select: (data: (TLoadBalancerFlavor & { pricing: TPrice[] })[]) => TData;
};

const loadBalancerCatalogQuery = (ovhSubsidiary: string) => ({
  queryKey: loadBalancerCatalogQueryKey(ovhSubsidiary),
  queryFn: () => getLoadBalancerCatalog({ ovhSubsidiary }),
});

const loadBalancerProductAvailabilityQuery = (projectId: string, ovhSubsidiary: string) => ({
  queryKey: productAvailabilityQueryKey(projectId, ovhSubsidiary),
  queryFn: () => getLoadBalancerProductAvailability({ projectId, ovhSubsidiary }),
});

const loadBalancerFlavorsQuery = (projectId: string, region: string) => ({
  queryKey: loadBalancerFlavorsQueryKey(projectId, region),
  queryFn: () => getLoadBalancerFlavors({ projectId, region: region }),
});

export const useLoadBalancerFlavors = <TData>({
  projectId,
  region,
  ovhSubsidiary,
  select,
}: TUseLoadBalancerFlavorsOptions<TData>) =>
  useQueries({
    queries: [
      loadBalancerCatalogQuery(ovhSubsidiary),
      loadBalancerProductAvailabilityQuery(projectId, ovhSubsidiary),
      loadBalancerFlavorsQuery(projectId, region),
    ],
    combine: ([
      { data: catalog = [], isPending: isCatalogPending },
      {
        data: loadBalancerAvailabilityRegions = [],
        isPending: isLoadBalancerAvailabilityRegionsPending,
      },
      { data: flavors = [], isPending: isFlavorsPending },
    ]) => {
      const loadBalancerPricings = loadBalancerAvailabilityRegions
        .map((loadBalancerRegions) => ({
          ...loadBalancerRegions,
          ...(catalog.find((catalog) => catalog.planCode === loadBalancerRegions.planCode) ?? {}),
        }))
        .filter((loadBalancer) => loadBalancer.regions.includes(region));

      const loadBalancerFlavors = flavors.map((flavor) => ({
        ...flavor,
        pricing:
          loadBalancerPricings.find(
            (pricing) => mapFlavorSizeToLabel(pricing.product.split('-').pop()) === flavor.name,
          )?.pricing ?? [],
      }));

      return {
        loadBalancerFlavors: select(loadBalancerFlavors),
        isPending: isCatalogPending || isLoadBalancerAvailabilityRegionsPending || isFlavorsPending,
      };
    },
  });
