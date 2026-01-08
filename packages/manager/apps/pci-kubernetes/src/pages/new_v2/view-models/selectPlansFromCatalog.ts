// selectPlans.ts (View Model)
import { TClusterPlanEnum, TPlan } from '@/types';

type Catalog = {
  addons: Array<{
    planCode: string;
    pricings: Array<{ price: number }>;
  }>;
};

type PlanDefinition = Omit<TPlan, 'price' | 'code'>;

const getPlanDefinitions = (isMultiZone: boolean): Record<TClusterPlanEnum, PlanDefinition> => ({
  [TClusterPlanEnum.FREE]: {
    title: 'kube_add_plan_title_free',
    description: 'kube_add_plan_description_free',
    content: [
      'kube_add_plan_content_free_control',
      'kube_add_plan_content_free_high_availability',
      'kube_add_plan_content_free_SLO',
      'kube_add_plan_content_free_auto_scaling',
      'kube_add_plan_content_free_ETCD',
      'kube_add_plan_content_free_version',
      'kube_add_plan_content_free_100',
    ],
    value: TClusterPlanEnum.FREE,
  },
  [TClusterPlanEnum.STANDARD]: {
    title: 'kube_add_plan_title_standard',
    description: 'kube_add_plan_description_standard',
    content: [
      `kube_add_plan_content_standard_${isMultiZone ? '3' : '1'}AZ_control_plane`,
      ...(isMultiZone ? ['kube_add_plan_content_standard_disponibility'] : []),
      'kube_add_plan_content_standard_SLA',
      'kube_add_plan_content_free_auto_scaling',
      'kube_add_plan_content_standard_ETCD',
      'kube_add_plan_content_standard_version',
      'kube_add_plan_content_standard_500',
    ],
    value: TClusterPlanEnum.STANDARD,
  },
});

const getPriceFromCatalog = (catalog: Catalog | undefined, code: string): number | null =>
  catalog?.addons.find((addon) => addon.planCode === code)?.pricings[0]?.price ?? null;

const findCodeByPlanType = (codes: string[], planType: TClusterPlanEnum): string | null =>
  codes.find((code) => code.includes(planType)) ?? null;

const selectPlansFromCatalog = (
  codes: string[],
  catalog: Catalog | undefined,
  isMultiZone: boolean = false,
): TPlan[] => {
  const definitions = getPlanDefinitions(isMultiZone);

  return Object.values(definitions).map((definition) => {
    const code = findCodeByPlanType(codes, definition.value);
    return {
      ...definition,
      code,
      price: code ? getPriceFromCatalog(catalog, code) : null,
    };
  });
};

export default selectPlansFromCatalog;
