import { TCatalog, TProductAvailability } from '@ovh-ux/manager-pci-common';

import { isSnapshotConsumption } from '@/pages/new/utils/is-snapshot-consumption';

export const getRegionPricing =
  (snapshotAvailabilities: TProductAvailability, catalog: TCatalog) => (region: string) => {
    const regionPlan =
      snapshotAvailabilities?.plans.find(
        (plan) => isSnapshotConsumption(plan.code) && plan.regions.some((r) => r.name === region),
      ) || null;

    if (!catalog || !regionPlan) return null;

    return (
      catalog.addons
        .find((addon) => addon.planCode === regionPlan.code)
        ?.pricings.find(({ intervalUnit }) => intervalUnit === 'none' || intervalUnit === 'hour') ??
      null
    );
  };
