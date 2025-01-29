import { useMemo } from 'react';
import {
  useProductAvailability,
  useProject,
  TCatalog,
  TAddon,
} from '@ovh-ux/manager-pci-common';
import { useCloudCatalog } from './catalog/useCloudCatalog';

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

const getSmallestGateway = (catalog: TCatalog, plans: string[]) => {
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

// TODO: similar use case in network and compute, think to move it to pci-common
export const useSmallestGatewayByRegion = (region: string) => {
  const { data } = useCloudCatalog();

  const plans = useRegionPlans(region);

  return useMemo(
    () => (data && plans.length > 0 ? getSmallestGateway(data, plans) : null),
    [data, plans],
  );
};
