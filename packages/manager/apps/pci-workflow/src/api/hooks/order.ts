import { useQuery } from '@tanstack/react-query';
import { useProject } from '@ovh-ux/manager-pci-common';
import { getCatalog } from '@/api/data/order';

export const getCatalogQuery = (ovhSubsidiary: string) => ({
  queryKey: ['catalog', ovhSubsidiary],
  queryFn: () => getCatalog(ovhSubsidiary),
});

export const useCatalog = (ovhSubsidiary: string) =>
  useQuery({
    ...getCatalogQuery(ovhSubsidiary),
    enabled: !!ovhSubsidiary,
  });

export const useProjectAddons = (projectId: string, ovhSubsidiary: string) => {
  const { data: project } = useProject(projectId);
  return useQuery({
    ...getCatalogQuery(ovhSubsidiary),
    enabled: !!project && !!ovhSubsidiary,
    select: (catalog) => {
      const projectPlan = catalog.plans.find(
        ({ planCode }) => planCode === project.planCode,
      );
      const projectAddons = [
        ...new Set(projectPlan.addonFamilies.map((f) => f.addons).flat()),
      ].map((addon) =>
        catalog.addons.find(({ planCode }) => planCode === addon),
      );
      return projectAddons;
    },
  });
};

export const useInstanceSnapshotPricing = (
  projectId: string,
  instanceRegion: string,
  ovhSubsidiary: string,
) => {
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
