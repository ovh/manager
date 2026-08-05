import { useMemo } from 'react';
import { TNetworkCatalog } from '@/api/data/catalog/network';
import { useNetworkCatalog } from '@/api/hooks/catalog/useNetworkCatalog';

const PUBLIC_IP_MODEL = 'PublicIP';

const selectBasicIpCatalog = (catalog: TNetworkCatalog) => ({
  offers:
    catalog.ipModels?.find(({ type }) => type === PUBLIC_IP_MODEL)?.pricings ??
    [],
  regions: catalog.regions ?? [],
});

export const useBasicIpCatalog = (projectId: string) => {
  const { data, isFetching } = useNetworkCatalog(
    projectId,
    selectBasicIpCatalog,
  );

  return useMemo(() => {
    const offers = data?.offers ?? [];
    const prices = offers.map(({ price }) => price.priceInUcents);
    const regionNames = offers.flatMap(({ regions }) => regions);

    return {
      isFetching,
      regionNames,
      regions: (data?.regions ?? []).filter(({ name }) =>
        regionNames.includes(name),
      ),
      cheapestPrice: prices.length ? Math.min(...prices) : 0,
      hasPriceVariation: new Set(prices).size > 1,
      getRegionPrice: (regionName: string) =>
        offers.find(({ regions }) => regions.includes(regionName))?.price
          .priceInUcents ?? 0,
    };
  }, [data, isFetching]);
};
