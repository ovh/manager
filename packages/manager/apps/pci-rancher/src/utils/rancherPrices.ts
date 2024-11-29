import { convertHourlyPriceToMonthly } from '@ovh-ux/manager-react-components';
import { TAddon, TCatalog } from '@ovh-ux/manager-pci-common';
import { RancherPlanCode, RancherPlanName } from '@/types/api.type';

export const findPlanByCode = (catalog: TCatalog, planCode: RancherPlanCode) =>
  catalog?.addons.find((element) => element.planCode === planCode);

export const isConsumptionPlan = (plan: TAddon) =>
  plan?.pricings?.[0]?.capacities.includes('consumption');

export const getRancherPlanName = (planCode: RancherPlanCode) =>
  planCode.includes('ovhcloud')
    ? RancherPlanName.OVHCLOUD_EDITION
    : RancherPlanName.STANDARD;

export const getPlanPricing = (
  catalog: TCatalog,
  planCode: RancherPlanCode,
) => {
  const plan = findPlanByCode(catalog, planCode);
  const isConsumption = isConsumptionPlan(plan);
  const hourlyPrice = plan?.pricings?.[0]?.price || 0;
  const monthlyPrice = convertHourlyPriceToMonthly(hourlyPrice);
  const name = getRancherPlanName(planCode);

  return isConsumption && hourlyPrice
    ? { name, hourlyPrice, monthlyPrice }
    : { name, hourlyPrice: 0, monthlyPrice: 0 };
};
