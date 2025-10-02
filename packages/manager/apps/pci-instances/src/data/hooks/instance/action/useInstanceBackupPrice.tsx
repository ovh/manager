import { convertHourlyPriceToMonthly, useTranslatedMicroRegions, } from '@ovh-ux/manager-react-components';
import { TProductAvailabilityRegion, useCatalog, useProductAvailability, } from '@ovh-ux/manager-pci-common';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { useIsDistantBackupAvailable } from '@/data/hooks/feature';
import { groupBy } from '@/utils';

type ContinentRegion = Pick<TProductAvailabilityRegion, 'enabled' | 'name'> & {
  label: string;
};

export const useInstanceBackupPrice = (projectId: string, region: string) => {
  const { i18n } = useTranslation('actions');
  const {
    translateMicroRegion,
    translateContinentRegion,
  } = useTranslatedMicroRegions();
  const isDistantBackupAvailable = useIsDistantBackupAvailable();

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

  const currentRegion = useMemo(
    () => currentPlan?.regions.find((r) => r.name === region),
    [currentPlan, region],
  );

  const distantContinents = useMemo<Map<string, ContinentRegion[]>>(() => {
    if (
      !productAvailability ||
      !currentRegion ||
      // Only 1AZ and 3AZ can have distant backups for now
      (currentRegion.type !== 'region' &&
        currentRegion.type !== 'region-3-az') ||
      !isDistantBackupAvailable
    )
      return new Map<string, ContinentRegion[]>();

    return groupBy(
      productAvailability.plans
        .filter((plan) => plan.code.startsWith('snapshot.consumption'))
        .flatMap((plan) => plan.regions)
        .filter(
          (productRegion) =>
            productRegion.name !== region &&
            // Distant backups can be created only in distant 1AZ and 3AZ for now
            (productRegion.type === 'region' ||
              productRegion.type === 'region-3-az'),
        )
        .map((productRegion) => ({
          ...productRegion,
          label: translateMicroRegion(productRegion.name) || productRegion.name,
        })),
      (productRegion: TProductAvailabilityRegion) =>
        translateContinentRegion(productRegion.name) || 'Internal',
    );
  }, [
    productAvailability,
    currentRegion,
    region,
    translateMicroRegion,
    translateContinentRegion,
  ]);

  return {
    price,
    isLoading: isProductAvailabilityLoading || isCatalogLoading,
    distantContinents,
  };
};
