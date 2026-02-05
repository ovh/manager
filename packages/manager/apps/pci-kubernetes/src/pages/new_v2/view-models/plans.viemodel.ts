import { convertHourlyPriceToMonthly } from '@ovh-ux/muk';

import { useAvailabilityRegions } from '@/api/hooks/useAvailabilityRegions';
import { useCloudCatalog } from '@/api/hooks/useCloudCatalog';
import { TCloudCatalog, TPlanCode } from '@/domain/entities/cloudCatalog';
import { TRegions } from '@/domain/entities/regions';

import { TCreateClusterSchema } from '../CreateClusterForm.schema';

type TPlanContent = {
  title: string;
  description: string;
  content: string[];
  code: TPlanCode;
  planType: TCreateClusterSchema['planType'];
};

type TPlanTilePrice = {
  priceExclVat: number;
  priceInclVat: number;
};

export type TPlanTile = TPlanContent & {
  price: TPlanTilePrice | null;
  disabled: boolean;
};

const getPlanDefinition = (plan: TPlanCode): TPlanContent => {
  switch (plan) {
    case 'mks.free.hour.consumption':
      return {
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
        code: 'mks.free.hour.consumption',
        planType: 'free',
      };
    case 'mks.standard.hour.consumption':
      return {
        title: 'kube_add_plan_title_standard',
        description: 'kube_add_plan_description_standard',
        content: [
          `kube_add_plan_content_standard_1AZ_control_plane`,
          'kube_add_plan_content_standard_disponibility',
          'kube_add_plan_content_standard_1AZ_SLA',
          'kube_add_plan_content_free_auto_scaling',
          'kube_add_plan_content_standard_ETCD',
          'kube_add_plan_content_standard_version',
          'kube_add_plan_content_standard_500',
        ],
        code: 'mks.standard.hour.consumption',
        planType: 'standard',
      };
    case 'mks.standard.hour.consumption.3az':
      return {
        title: 'kube_add_plan_title_standard',
        description: 'kube_add_plan_description_standard',
        content: [
          `kube_add_plan_content_standard_3AZ_control_plane`,
          'kube_add_plan_content_standard_disponibility',
          'kube_add_plan_content_standard_3AZ_SLA',
          'kube_add_plan_content_free_auto_scaling',
          'kube_add_plan_content_standard_ETCD',
          'kube_add_plan_content_standard_version',
          'kube_add_plan_content_standard_500',
        ],
        code: 'mks.standard.hour.consumption.3az',
        planType: 'standard',
      };
  }
};

const getPlanList = (isMultiZone: boolean = false): Array<TPlanCode> => {
  return isMultiZone
    ? ['mks.standard.hour.consumption.3az', 'mks.free.hour.consumption']
    : ['mks.standard.hour.consumption', 'mks.free.hour.consumption'];
};

const getPlanPrice = (planType: TPlanCode, catalog: TCloudCatalog): TPlanTilePrice | null => {
  const plans = catalog.entities.plans;
  const plan = plans[planType]?.pricings[0];
  if (!plan) return null;

  return {
    priceExclVat: convertHourlyPriceToMonthly(plan.price),
    priceInclVat: convertHourlyPriceToMonthly(plan.price + plan.tax),
  };
};

const getPlanCode = (planType: TPlanTile['planType'], isMultiZone: boolean): TPlanCode => {
  switch (planType) {
    case 'standard':
      return isMultiZone ? 'mks.standard.hour.consumption.3az' : 'mks.standard.hour.consumption';
    case 'free':
      return 'mks.free.hour.consumption';
  }
};

export const selectPlansFromCatalog =
  (isMultiZone: boolean, regionPlanTypes?: Array<TPlanTile['planType']>) =>
  (catalog: TCloudCatalog | undefined): Array<TPlanTile> => {
    if (!catalog) return [];

    const planTypes: Array<TPlanCode> = getPlanList(isMultiZone);

    return planTypes.map((planType) => {
      const planDef = getPlanDefinition(planType);

      return {
        ...planDef,
        price: getPlanPrice(planType, catalog),
        disabled: regionPlanTypes ? !regionPlanTypes?.includes(planDef.planType) : false,
      };
    });
  };

export const selectPlanPrices =
  (isMultiZone: boolean, planType: TPlanTile['planType']) =>
  (catalog: TCloudCatalog | undefined) => {
    if (!catalog) return null;

    const code = getPlanCode(planType, isMultiZone);

    const plans = catalog.entities.plans;
    const plan = plans[code]?.pricings[0];
    if (!plan) return null;

    return {
      hourlyPrice: plan.price,
      hourlyTax: plan.tax,
    };
  };

export const selectRegionPlanType =
  (macroRegionId: string) =>
  (regions: TRegions | undefined): Array<TPlanTile['planType']> => {
    const macroRegion = regions?.entities.macroRegions.byId.get(macroRegionId);
    if (!macroRegion) return [];

    return macroRegion.plans.map((plan) => {
      switch (plan) {
        case 'mks.standard.hour.consumption':
        case 'mks.standard.hour.consumption.3az':
          return 'standard';
        case 'mks.free.hour.consumption':
          return 'free';
      }
    });
  };

export const usePlanTiles = (macroRegion: string, isMultiZone: boolean) => {
  const { data: regionPlanTypes } = useAvailabilityRegions({
    select: selectRegionPlanType(macroRegion ?? ''),
  });

  const { data: plans } = useCloudCatalog({
    select: selectPlansFromCatalog(isMultiZone, regionPlanTypes),
  });

  return {
    plans,
  };
};
