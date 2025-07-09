import {
  convertHourlyPriceToMonthly,
  useTranslatedMicroRegions,
} from '@ovh-ux/manager-react-components';
import {
  useProductAvailability,
  useCatalog,
  TProductAvailabilityRegion,
} from '@ovh-ux/manager-pci-common';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

type ContinentRegion = Pick<TProductAvailabilityRegion, 'enabled' | 'name'> & {
  label: string;
};

export const useInstanceBackupPrice = (projectId: string, region: string) => {
  const { i18n } = useTranslation('actions');
  const {
    translateMicroRegion,
    translateContinentRegion,
  } = useTranslatedMicroRegions();

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
      !currentPlan ||
      !currentRegion ||
      (currentRegion.type !== 'region' && currentRegion.type !== 'region-3-az')
    )
      return new Map<string, ContinentRegion[]>();

    return Map.groupBy(
      currentPlan.regions
        .filter(
          (r) =>
            r.name !== region &&
            (r.type === 'region' || r.type === 'region-3-az'),
        )
        .map((r) => ({
          ...r,
          label: translateMicroRegion(r.name) || r.name,
        })),
      (r) => translateContinentRegion(r.name),
    );
  }, [
    currentPlan,
    currentRegion,
    translateMicroRegion,
    translateContinentRegion,
  ]);

  return {
    price,
    isLoading: isProductAvailabilityLoading || isCatalogLoading,
    distantContinents,
  };
};
