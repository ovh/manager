import { TCreateClusterSchema } from '../CreateClusterForm.schema';

type PlanOption = {
  labelKey: string;
  plan: TCreateClusterSchema['plan'];
};

// TODO (TAPC-5549): Make this a real select based on API data
export const selectPlanOptions = (): Array<PlanOption> => {
  return [
    { labelKey: 'kubernetes_add_region_plan_all', plan: 'all' },
    { labelKey: 'kube_add_plan_title_standard', plan: 'standard' },
    { labelKey: 'kube_add_plan_title_free', plan: 'free' },
  ];
};
