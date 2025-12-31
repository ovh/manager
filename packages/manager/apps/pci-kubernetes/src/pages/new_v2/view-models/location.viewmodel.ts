import { TCountryCode, TMacroRegion, TRegions } from '@/domain/entities/regions';

import { TCreateClusterSchema, createClusterFormContinentCodes } from '../CreateClusterForm.schema';

export type TRegionCard = {
  label: string;
  id: string;
  microRegions: string[];
  disabled: boolean;
  country: TCountryCode;
};

type ContinentOption = {
  labelKey: string;
  continentCode: TCreateClusterSchema['location']['continent'];
};

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

export const selectPlanOptions = (): Array<PlanOption> => {
  return [
    { labelKey: 'kubernetes_add_region_plan_all', plan: 'all' },
    { labelKey: 'kube_add_plan_title_standard', plan: 'standard' },
    { labelKey: 'kube_add_plan_title_free', plan: 'free' },
  ];
};

export const selectMacroRegions = (regions?: TRegions) => {
  return regions ? [...regions.entities.macroRegions.byId.values()] : undefined;
};

export const filterMacroRegions =
  (
    continent: TCreateClusterSchema['location']['continent'],
    plan: TCreateClusterSchema['location']['plan'],
  ) =>
  (regions?: Array<TMacroRegion>) => {
    if (!regions) return undefined;

    return regions.filter((region) => {
      const isContinentAllowed = continent === 'ALL' || region.continentCode === continent;
      const isPlanAllowed = plan === 'all' || !plan; // || region.plans.includes(plan);

      return isContinentAllowed && isPlanAllowed;
    });
  };

export const mapMacroRegionForCards =
  (translateRegionName: (region: string) => string) =>
  (regions?: TMacroRegion[]): TRegionCard[] | undefined =>
    regions?.map((region) => ({
      label: translateRegionName(region.name),
      id: region.name,
      microRegions: region.microRegionIds,
      disabled: region.disabled,
      country: region.countryCode,
    }));
