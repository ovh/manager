import {
  convertHourlyPriceToMonthly,
  priceFromUcent,
} from '@ovh-ux/manager-react-components';
import { useProductAvailability, useCatalog } from '@ovh-ux/manager-pci-common';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

export const useInstanceBackupPrice = (projectId: string, region: string) => {
  const { i18n } = useTranslation('actions');
  const locale = i18n?.language?.replace('_', '-');
  const {
    data: productAvailability,
    isLoading: isProductAvailabilityLoading,
  } = useProductAvailability(projectId, {
    addonFamily: 'snapshot',
  });
  const { data: catalog, isLoading: isCatalogLoading } = useCatalog();

  const validPlans = productAvailability?.plans.filter((p) =>
    p.code.startsWith('snapshot.consumption'),
  );

  const regionPlans = validPlans?.filter((p) =>
    p.regions.some((r) => r.name === region),
  );

  const currentPlan = regionPlans?.[0];

  const plan = catalog?.addons.find(
    (addon) => addon.planCode === currentPlan?.code,
  );

  const price = plan?.pricings[0];

  return {
    price: useMemo(
      () =>
        convertHourlyPriceToMonthly(
          priceFromUcent(Number(price?.price)),
        ).toLocaleString(locale, {
          maximumFractionDigits: 3,
        }) ?? null,
      [price, locale],
    ),
    isLoading: isProductAvailabilityLoading || isCatalogLoading,
  };
};
