import { useMemo } from 'react';
import { TNetworkCatalog } from '@/api/data/catalog/network';
import { useNetworkCatalog } from '@/api/hooks/catalog/useNetworkCatalog';

const PUBLIC_IP_MODEL = 'PublicIP';

const selectPublicIpOffers = (catalog: TNetworkCatalog) =>
  catalog.ipModels?.find(({ type }) => type === PUBLIC_IP_MODEL)?.pricings ??
  [];

export const useBasicIpCatalog = (projectId: string) => {
  const { data: offers, isFetching } = useNetworkCatalog(
    projectId,
    selectPublicIpOffers,
  );

  return useMemo(() => {
    const availableOffers = offers ?? [];
    const prices = availableOffers.map(({ price }) => price.priceInUcents);

    return {
      isFetching,
      regionNames: availableOffers.flatMap(({ regions }) => regions),
      cheapestPrice: prices.length ? Math.min(...prices) : 0,
      hasPriceVariation: new Set(prices).size > 1,
      getRegionPrice: (regionName: string) =>
        availableOffers.find(({ regions }) => regions.includes(regionName))
          ?.price.priceInUcents ?? 0,
    };
  }, [offers, isFetching]);
};
