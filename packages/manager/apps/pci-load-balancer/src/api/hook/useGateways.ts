import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  useProductAvailability,
  TCatalog,
  TAddon,
  useCatalog,
} from '@ovh-ux/manager-pci-common';
import { getSubnetGateways } from '@/api/data/gateways';
import { GATEWAY_SIZE_LABEL_ORDER } from '@/constants';

export const useGetSubnetGateways = (
  projectId: string,
  regionName: string,
  subnetId: string,
) =>
  useQuery({
    queryKey: [
      'project',
      projectId,
      'region',
      regionName,
      'subnet',
      subnetId,
      'gateways',
    ],
    queryFn: () => getSubnetGateways(projectId, regionName, subnetId),
    enabled: !!projectId && !!regionName && !!subnetId,
    throwOnError: true,
  });

export const useRegionPlans = (regionName: string, projectId: string) => {
  const { data } = useProductAvailability(projectId, {
    addonFamily: 'gateway',
  });

  return useMemo(
    () =>
      data?.plans
        .filter((plan) =>
          plan.regions.some((region) => region.name === regionName),
        )
        .map((item) => item.code) || [],
    [data, regionName],
  );
};

const getGatewaySize = (addon: TAddon) => addon.product.split('-').pop();

const getGatewayAddonsByPlanCodes = (
  catalog: TCatalog,
  plans: string[],
): TAddon[] =>
  catalog.addons
    .filter((addon) => plans.includes(addon.planCode))
    .slice()
    .sort((a, b) => {
      const sizeA = getGatewaySize(a);
      const sizeB = getGatewaySize(b);

      return (
        GATEWAY_SIZE_LABEL_ORDER.indexOf(sizeA) -
        GATEWAY_SIZE_LABEL_ORDER.indexOf(sizeB)
      );
    });

// TODO: similar use case in floating IP, private network and compute, think to move it to pci-common
export const useSmallestGatewayByRegion = (
  region: string,
  projectId: string,
) => {
  const plans = useRegionPlans(region, projectId);
  const { data: catalog } = useCatalog();

  return useMemo(() => {
    const addons = catalog ? getGatewayAddonsByPlanCodes(catalog, plans) : [];
    const hourlyAddon = addons.filter((addon) =>
      ['none', 'hour'].includes(addon.pricings[0].intervalUnit),
    );

    return hourlyAddon[0]
      ? {
          size: getGatewaySize(hourlyAddon[0]),
          price: hourlyAddon[0].pricings[0].price,
        }
      : null;
  }, [plans, catalog]);
};
