import { DeploymentMode, TClusterPlanEnum, TPlan } from '@/types';

type PlanDefinition = Omit<TPlan, 'price' | 'code'>;

const getPlanDefinitions = (
  isMultiZone: boolean,
): Record<Exclude<TClusterPlanEnum, TClusterPlanEnum.ALL>, PlanDefinition> => ({
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

const getPriceFromCatalog = (code?: string): number | null => (code ? 90000 : null);

const findCodeByPlanType = (codes: string[], planType: TClusterPlanEnum): string | null =>
  codes.find((code) => code.includes(planType)) || null;

export const selectPlansFromCatalog = (
  codes: string[],
  isMultiZone: boolean = false,
): Array<TPlan & { type: DeploymentMode }> => {
  const definitions = getPlanDefinitions(isMultiZone);

  return Object.values(definitions).map((definition) => {
    const code = findCodeByPlanType(codes, definition.value);
    return {
      ...definition,
      type: isMultiZone ? DeploymentMode.MULTI_ZONES : DeploymentMode.MONO_ZONE,
      code,
      price: code ? getPriceFromCatalog(code) : null,
    };
  });
};
