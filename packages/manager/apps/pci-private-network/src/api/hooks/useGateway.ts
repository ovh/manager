import { useQuery } from '@tanstack/react-query';
import {
  getGateways,
  getGatewayCatalog,
  getGatewaysByRegion,
} from '@/api/data/regions';

export const useGateways = (projectId: string) =>
  useQuery({
    queryKey: ['project', projectId, 'gateway'],
    queryFn: () => getGateways(projectId),
  });

export const useGatewayByRegion = (
  projectId: string,
  regionName: string,
  enabled = true,
) =>
  useQuery({
    queryKey: ['project', projectId, 'region', regionName, 'gateway'],
    queryFn: () => getGatewaysByRegion(projectId, regionName),
    enabled,
    select: (gateways) =>
      gateways.map((gateway) => ({
        ...gateway,
        region: regionName,
      })),
  });

export const useGatewayCatalog = (
  ovhSubsidiary: string,
  productName?: string,
) =>
  useQuery({
    queryKey: ['gateway', 'catalog', ovhSubsidiary],
    queryFn: () => getGatewayCatalog(ovhSubsidiary, productName),
    select: (data) => {
      // pick the variants of product with least price
      const gatewayProducts = data?.addons
        .filter((addon) => addon.product.startsWith('publiccloud-gateway'))
        .sort(
          (
            { pricings: [{ price: priceA }] },
            { pricings: [{ price: priceB }] },
          ) => priceA - priceB,
        )
        .filter(({ product }, _index, arr) => product === arr[0].product);

      const monthlyPriceObj = gatewayProducts.find(({ planCode }) =>
        planCode.includes('month'),
      )?.pricings[0];

      const hourlyPriceObj = gatewayProducts.find(({ planCode }) =>
        planCode.includes('hour'),
      )?.pricings[0];

      return {
        size: gatewayProducts[0].product
          .split('-')
          .slice(-1)
          .join(),
        pricePerMonth: monthlyPriceObj.price,
        pricePerHour: hourlyPriceObj.price,
      };
    },
  });
