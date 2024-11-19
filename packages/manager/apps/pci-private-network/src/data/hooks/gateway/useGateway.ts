import { useContext } from 'react';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getCatalog } from '@ovh-ux/manager-pci-common';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { getGatewaysByRegion } from '@/data/api/gateway';

export type TUseGatewayCatalog = UseQueryResult<
  { size: string; pricePerMonth: number; pricePerHour: number },
  Error
>;

export const useGatewayByRegion = (projectId: string, region: string) =>
  useQuery({
    queryKey: ['project', projectId, 'region', region, 'gateway'],
    queryFn: () => getGatewaysByRegion(projectId, region),
    enabled: !!region,
    select: (gateways) =>
      gateways.map((gateway) => ({
        ...gateway,
        region,
      })),
  });

export const useGatewayCatalog = (): TUseGatewayCatalog => {
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();

  return useQuery({
    queryKey: ['gateway', 'catalog', ovhSubsidiary],
    queryFn: () => getCatalog(ovhSubsidiary),
    select: (data) => {
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
};
