import { useContext, useMemo } from 'react';
import {
  useProductAvailability,
  useProject,
  TCatalog,
  getCatalog,
  TAddon,
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

const getGatewaySize = (addon: TAddon) => addon.product.split('-').pop();

const getSmallestGateway = (
  catalog: TCatalog,
  plans: string[],
): TGatewayCatalog => {
  const sizeOrder = ['s', 'm', 'l', 'xl', '2xl'];

  const gateways = catalog.addons
    .filter((addon) => plans.includes(addon.planCode))
    .sort((a, b) => {
      const sizeA = getGatewaySize(a);
      const sizeB = getGatewaySize(b);

      return sizeOrder.indexOf(sizeA) - sizeOrder.indexOf(sizeB);
    });

  return {
    size: getGatewaySize(gateways[0]),
    price: gateways[0].pricings[0].price,
  };
};

// TODO: similar use case in floating IP and compute, think to move it to pci-common
export const useSmallestGatewayByRegion = (region: string) => {
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();
  const plans = useRegionPlans(region);

  return useQuery({
    queryKey: ['gateway', 'catalog', region, ovhSubsidiary],
    queryFn: () => getCatalog(ovhSubsidiary),
    select: (catalog) => getSmallestGateway(catalog, plans),
    enabled: plans.length > 0,
  });
};
