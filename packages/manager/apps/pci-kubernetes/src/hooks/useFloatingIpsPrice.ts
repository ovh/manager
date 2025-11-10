import { useCallback } from 'react';

import { useCatalog } from '@ovh-ux/manager-pci-common';
import { useCatalogPrice } from '@ovh-ux/manager-react-components';

import { getPlanCodeFloatingIps } from '@/helpers/node-pool';
import { DeploymentMode } from '@/types';

const useFloatingIpsPrice = (
  time: 'hour' | 'month',
  deploymentMode: DeploymentMode | null,
) => {
  const { data: catalog, isPending: isPendingCatalog } = useCatalog();
  const {
    getFormattedHourlyCatalogPrice,
    getFormattedMonthlyCatalogPrice,
  } = useCatalogPrice(5);

  const getPrice = useCallback(
    (code: string) => {
      if (catalog) {
        const getAddon = catalog.addons.find((add) => add.planCode === code);
        return getAddon?.pricings[0]?.price ?? null;
      }
      return null;
    },
    [catalog],
  );

  const planCodeFloatingIp = getPlanCodeFloatingIps(time, deploymentMode);
  const price = planCodeFloatingIp ? getPrice(planCodeFloatingIp) : null;

  if (!price)
    return { isPending: isPendingCatalog, price: { hour: null, month: null } };

  return {
    isPending: isPendingCatalog,
    price: {
      hour: getFormattedHourlyCatalogPrice(price),
      month: getFormattedMonthlyCatalogPrice(price),
    },
  };
};

export default useFloatingIpsPrice;
