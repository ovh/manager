import { useCallback } from 'react';

import { useCatalog } from '@ovh-ux/manager-pci-common';
import { convertHourlyPriceToMonthly, useCatalogPrice } from '@ovh-ux/manager-react-components';

import { getPlanCodeFloatingIps } from '@/helpers/node-pool';
import { DeploymentMode } from '@/types';

const useFloatingIpsPrice = (enabled = false, deploymentMode: DeploymentMode | null) => {
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

  const [hour, month] = (['hour', 'month'] as const).map((time) => {
    const planCodeFloatingIp = getPlanCodeFloatingIps(time, deploymentMode);
    const price = planCodeFloatingIp ? getPrice(planCodeFloatingIp) : null;
    return price;
  }) as [number | null, number | null];

  if (hour === null) return { isPending: isPendingCatalog, price: null };

  const monthlyPrice = month ?? convertHourlyPriceToMonthly(hour);

  return {
    isPending: isPendingCatalog,
    price: {
      hour,
      // for now we do not take into account the catalog monthly price
      month: convertHourlyPriceToMonthly(hour),
      hourFormatted: getFormattedHourlyCatalogPrice(hour),
      monthFormatted: getFormattedMonthlyCatalogPrice(monthlyPrice),
    },
  };
};

export default useFloatingIpsPrice;
