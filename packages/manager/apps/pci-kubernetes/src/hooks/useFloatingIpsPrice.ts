import { useCallback } from 'react';

import { useCatalog } from '@ovh-ux/manager-pci-common';
import { convertHourlyPriceToMonthly, useCatalogPrice } from '@ovh-ux/manager-react-components';

import { getPlanCodeFloatingIps } from '@/helpers/node-pool';
import { DeploymentMode } from '@/types';

const useFloatingIpsPrice = (
  enabled = false,
  time: 'hour' | 'month',
  deploymentMode: DeploymentMode | null,
) => {
  const { data: catalog, isPending: isPendingCatalog } = useCatalog();
  const { getFormattedHourlyCatalogPrice, getFormattedMonthlyCatalogPrice } = useCatalogPrice(5);

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

  if (!enabled) {
    return { isPending: isPendingCatalog, price: null };
  }

  const planCodeFloatingIp = getPlanCodeFloatingIps(time, deploymentMode);
  const price = planCodeFloatingIp ? getPrice(planCodeFloatingIp) : null;

  if (price === null) return { isPending: isPendingCatalog, price: null };

  const monthlyPrice = convertHourlyPriceToMonthly(price);

  return {
    isPending: isPendingCatalog,
    price: {
      hour: price,
      month: convertHourlyPriceToMonthly(price),
      hourFormatted: getFormattedHourlyCatalogPrice(price),
      monthFormatted: getFormattedMonthlyCatalogPrice(monthlyPrice),
    },
  };
};

export default useFloatingIpsPrice;
