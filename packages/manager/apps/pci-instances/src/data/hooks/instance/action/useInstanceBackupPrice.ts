import { convertHourlyPriceToMonthly } from '@ovh-ux/manager-react-components';
import { useProductAvailability, useCatalog } from '@ovh-ux/manager-pci-common';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

export const useInstanceBackupPrice = (projectId: string, region: string) => {
  const { i18n } = useTranslation('actions');
  const locale = i18n.language.replace('_', '-');
  const {
    data: productAvailability,
    isLoading: isProductAvailabilityLoading,
  } = useProductAvailability(projectId, {
    addonFamily: 'snapshot',
  });
  const { data: catalog, isLoading: isCatalogLoading } = useCatalog();

  const currentPlan = useMemo(
    () =>
      productAvailability?.plans.find(
        (p) =>
          p.code.startsWith('snapshot.consumption') &&
          p.regions.some((r) => r.name === region),
      ) || null,
    [productAvailability, region],
  );

  const pricing = useMemo(() => {
    if (!catalog || !currentPlan) return null;
    return (
      catalog.addons.find((addon) => addon.planCode === currentPlan.code)
        ?.pricings[0] || null
    );
  }, [catalog, currentPlan]);

  const price = useMemo(() => {
    if (!pricing) return null;

    return convertHourlyPriceToMonthly(pricing.price);
  }, [pricing, locale]);

  return {
    price,
    isLoading: isProductAvailabilityLoading || isCatalogLoading,
  };
};
