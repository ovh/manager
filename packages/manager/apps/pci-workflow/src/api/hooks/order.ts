import { useQuery, useQueries } from '@tanstack/react-query';
import {
  getCatalogQuery,
  getProductAvailabilityQuery,
  useProject,
} from '@ovh-ux/manager-pci-common';
import {
  isLocalZone,
  convertHourlyPriceToMonthly,
} from '@ovh-ux/manager-react-components';

export const useProjectAddons = (projectId: string, ovhSubsidiary: string) => {
  const { data: project } = useProject(projectId);
  return useQuery({
    ...getCatalogQuery(ovhSubsidiary),
    enabled: !!project && !!ovhSubsidiary,
    select: (catalog) => {
      const projectPlan = catalog.plans.find(
        ({ planCode }) => planCode === project.planCode,
      );
      return [
        ...new Set(projectPlan.addonFamilies.map((f) => f.addons).flat()),
      ].map((addon) =>
        catalog.addons.find(({ planCode }) => planCode === addon),
      );
    },
  });
};

const useRegionInstanceSnapshotPricing = (
  projectId: string,
  instanceRegion: string,
  ovhSubsidiary: string,
) => () => {
  const query = useProjectAddons(projectId, ovhSubsidiary);
  const addons = query.data;
  const snapshotAddon =
    addons?.find(
      (addon) =>
        addon.planCode === `snapshot.monthly.postpaid.${instanceRegion}`,
    ) ||
    addons?.find((addon) => addon.planCode === 'snapshot.monthly.postpaid') ||
    addons?.find((addon) => addon.planCode === 'snapshot.monthly');
  const [snapshotPricing] = (snapshotAddon?.pricings || [])?.filter(
    (p) =>
      p.capacities.includes('renew') || p.capacities.includes('consumption'),
  );
  return {
    ...query,
    data: snapshotPricing,
  };
};

const useLocalZoneInstanceSnapshotPricing = (
  projectId: string,
  instanceRegion: string,
  ovhSubsidiary: string,
) => () => {
  const queries = useQueries({
    queries: [
      { ...getCatalogQuery(ovhSubsidiary), enabled: Boolean(ovhSubsidiary) },
      {
        ...getProductAvailabilityQuery(projectId, ovhSubsidiary),
        enabled: Boolean(projectId) && Boolean(ovhSubsidiary),
      },
    ],
  });
  const [catalog, productAvailability] = queries;
  const snapshotPlanCode = productAvailability.data?.plans?.find(
    ({ code, regions }) =>
      code.startsWith('snapshot.consumption') &&
      regions.find(({ name }) => name === instanceRegion),
  )?.code;
  const snapshotAddon =
    catalog.data?.addons?.find(
      (addon) => addon.planCode === snapshotPlanCode,
    ) ||
    catalog.data?.addons?.find(
      (addon) => addon.planCode === 'snapshot.consumption.LZ',
    );
  const [snapshotPricing] = (snapshotAddon?.pricings || [])?.filter(
    (p) =>
      p.capacities.includes('renew') || p.capacities.includes('consumption'),
  );
  return {
    isPending: queries.some(({ isPending }) => isPending),
    data: {
      ...snapshotPricing,
      price: convertHourlyPriceToMonthly(snapshotPricing?.price || 0),
    },
  };
};

export const useInstanceSnapshotPricing = (
  projectId: string,
  instanceRegion: string,
  ovhSubsidiary: string,
) => {
  const getRegionSnapshotPricing = useRegionInstanceSnapshotPricing(
    projectId,
    instanceRegion,
    ovhSubsidiary,
  );
  const getLocalZoneSnapshotPricing = useLocalZoneInstanceSnapshotPricing(
    projectId,
    instanceRegion,
    ovhSubsidiary,
  );
  return isLocalZone
    ? getLocalZoneSnapshotPricing()
    : getRegionSnapshotPricing();
};
