import { useContext, useMemo } from 'react';
import {
  useProductAvailability,
  useProject,
  TCatalog,
  getCatalog,
} from '@ovh-ux/manager-pci-common';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useQuery } from '@tanstack/react-query';
import { TGatewayCatalog } from '@/types/gateway.type';

export const useRegionPlans = (regionName: string) => {
  const { data: project } = useProject();
  const { data } = useProductAvailability(project.project_id, {
    addonFamily: 'gateway',
  });

  return useMemo(() => {
    const plans = data?.plans.filter(({ code }) => code.includes('hour')) || [];
    const regionPlans =
      plans.filter((plan) =>
        plan.regions.some((region) => region.name === regionName),
      ) || [];

    return regionPlans.map((item) => item.code);
  }, [data, regionName]);
};

const getGatewayWithLowestPrice = (
  catalog: TCatalog,
  plans: string[],
): TGatewayCatalog => {
  const gatewayProducts = catalog.addons
    .filter((addon) => plans.includes(addon.planCode))
    .sort(
      ({ pricings: [{ price: priceA }] }, { pricings: [{ price: priceB }] }) =>
        priceA - priceB,
    )
    .filter(({ product }, _index, arr) => product === arr[0].product);

  const hourlyPriceObj = gatewayProducts.find(({ planCode }) =>
    planCode.includes('hour'),
  )?.pricings[0];

  return {
    size: gatewayProducts[0].product
      .split('-')
      .slice(-1)
      .join(),
    price: hourlyPriceObj?.price,
  };
};

// TODO: similar use case in floating IP and compute, think to move it to pci-common
export const useLowestPriceGatewayByRegion = (region: string) => {
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();
  const plans = useRegionPlans(region);

  return useQuery({
    queryKey: ['gateway', 'catalog', region, ovhSubsidiary],
    queryFn: () => getCatalog(ovhSubsidiary),
    select: (catalog) => getGatewayWithLowestPrice(catalog, plans),
    enabled: plans.length > 0,
  });
};
