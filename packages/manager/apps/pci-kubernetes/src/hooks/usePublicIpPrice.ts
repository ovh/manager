import { useParam } from '@ovh-ux/manager-pci-common';
import { convertHourlyPriceToMonthly, useCatalogPrice } from '@ovh-ux/manager-react-components';

import { getPublicIpHourlyPrice } from '@/api/data/network-catalog';
import { useNetworkCatalog } from '@/api/hooks/useNetworkCatalog';

import useRepricingInstancesAvailable from './useRepricingInstancesAvailable';

const usePublicIpPrice = (region: string | null) => {
  const { projectId } = useParam('projectId');
  const hasRepricing = useRepricingInstancesAvailable();
  const { data: catalog, isPending } = useNetworkCatalog(projectId, hasRepricing);
  const { getFormattedHourlyCatalogPrice, getFormattedMonthlyCatalogPrice } = useCatalogPrice(4, {
    exclVat: true,
  });

  const hour = getPublicIpHourlyPrice(catalog, 'PublicIP', region);

  if (hour === null) return { isPending, price: null };

  const month = convertHourlyPriceToMonthly(hour);

  return {
    isPending,
    price: {
      hour,
      month,
      hourFormatted: getFormattedHourlyCatalogPrice(hour),
      monthFormatted: getFormattedMonthlyCatalogPrice(month),
    },
  };
};

export default usePublicIpPrice;
