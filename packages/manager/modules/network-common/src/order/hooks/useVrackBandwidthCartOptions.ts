import { useQuery } from '@tanstack/react-query';

import { Price } from '@ovh-ux/manager-module-order';

import { getCartServiceOption } from '../api/get/cartServiceOption';
import {
  ASIA_PACIFIC_DEFAULT_BANDWIDTH_LIMIT,
  DEFAULT_BANDWIDTH_LIMIT,
  extractBandwidthLimitFromPlanCode,
} from '../utils/bandwidth';

export type { CartServiceOption, CartServiceOptionPrice } from '../api/get/cartServiceOption';

export type BandwidthOption = {
  bandwidthLimit: number;
  planCode: string;
  price: Price;
  priceInUcents: number;
};

export const vrackCartOptionsQueryKey = (serviceName: string) => [
  'cartOptions',
  'vrack',
  serviceName,
];

export const DEFAULT_BANDWIDTH_PLAN_CODE = 'default-bandwidth-plancode';

export function useVrackBandwidthCartOptions({
  serviceName,
  regions = [],
}: {
  serviceName: string;
  regions?: string[];
}) {
  const { isLoading, isError, error, data } = useQuery({
    queryKey: vrackCartOptionsQueryKey(serviceName),
    queryFn: () => getCartServiceOption({ serviceName, resourceType: 'vrack' }),
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
    enabled: !!serviceName && regions.length > 0,
  });

  return {
    isLoading,
    isError,
    error,
    vrackCartBandwidthOptionListByRegion: regions.reduce(
      (acc, region) => {
        acc[region] = (
          data?.data.filter(
            (option) =>
              option.family.includes('outgoing-bandwidth') &&
              option.planCode.toLowerCase().includes(region.toLowerCase()),
          ) || []
        )
          .map((option): BandwidthOption => {
            const selectedPrice = option.prices.find((price) => price.capacities.includes('renew'));

            return {
              bandwidthLimit: extractBandwidthLimitFromPlanCode(option.planCode),
              planCode: option.planCode,
              price: selectedPrice?.price || {
                currencyCode: 'EUR',
                value: 0,
                text: '0 €',
              },
              priceInUcents: selectedPrice?.priceInUcents || 0,
            };
          })
          .concat({
            bandwidthLimit: region.toLowerCase().includes('ap-')
              ? ASIA_PACIFIC_DEFAULT_BANDWIDTH_LIMIT
              : DEFAULT_BANDWIDTH_LIMIT,
            planCode: DEFAULT_BANDWIDTH_PLAN_CODE,
            price: { currencyCode: 'EUR', value: 0, text: '0 €' },
            priceInUcents: 0,
          })
          .sort((a, b) => a.bandwidthLimit - b.bandwidthLimit);

        return acc;
      },
      {} as Record<string, BandwidthOption[]>,
    ),
  };
}
