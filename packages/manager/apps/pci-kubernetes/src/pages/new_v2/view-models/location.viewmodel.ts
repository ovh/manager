import { TCreateClusterSchema, createClusterFormContinentCodes } from '../CreateClusterForm.schema';
import { TMockRegion } from '../mocks/regions.mock';

type ContinentOption = {
  labelKey: string;
  continentCode: TCreateClusterSchema['location']['continent'];
};

// TODO (TAPC-5549): Make this a real select based on API data
export const selectContinentOptions = (): Array<ContinentOption> => {
  return createClusterFormContinentCodes.map((code) => ({
    labelKey: `common_continent_label_${code}`,
    continentCode: code,
  }));
};

type PlanOption = {
  labelKey: string;
  plan: TCreateClusterSchema['location']['plan'];
};

// TODO (TAPC-5549): Make this a real select based on API data
export const selectPlanOptions = (): Array<PlanOption> => {
  return [
    { labelKey: 'kubernetes_add_region_plan_all', plan: 'all' },
    { labelKey: 'kube_add_plan_title_standard', plan: 'standard' },
    { labelKey: 'kube_add_plan_title_free', plan: 'free' },
  ];
};

export const filterMacroRegions =
  (
    continent: TCreateClusterSchema['location']['continent'],
    plan: TCreateClusterSchema['location']['plan'],
  ) =>
  (macroRegions: TMockRegion[]) => {
    return macroRegions.filter((region) => {
      const isContinentAllowed = continent === 'ALL' || region.continent === continent;
      const isPlanAllowed = plan === 'all' || !plan || region.plans.includes(plan);

      return isContinentAllowed && isPlanAllowed;
    });
  };
