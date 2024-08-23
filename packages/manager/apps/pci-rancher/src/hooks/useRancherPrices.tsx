import { useCatalog } from '@/api/';
import {
  RancherPlanCode,
  RancherPlanName,
  TRancherPricing,
} from '@/api/api.type';

export const useRancherPrices = () => {
  const { data: catalog, isLoading, isError } = useCatalog();

  if (!catalog || !catalog.addons.length) {
    throw new Error('Catalog not available');
  }

  const getRancherPrice = (planCode: string) => {
    const plan = catalog?.addons.find(
      (element) => element.planCode === planCode,
    );

    if (!plan) {
      throw new Error(`Plan ${planCode} not found`);
    }

    const isConsumption = plan?.pricings?.[0]?.capacities.includes(
      'consumption',
    );
    const hourlyPrice = plan?.pricings?.[0]?.price * 100_000_000 || 0;
    const monthlyPrice = hourlyPrice * 720 || 0;

    const selectedPlan = planCode.includes('ovhcloud')
      ? RancherPlanName.OVHCLOUD_EDITION
      : RancherPlanName.STANDARD;

    return isConsumption && hourlyPrice
      ? { name: selectedPlan, hourlyPrice, monthlyPrice }
      : { name: selectedPlan, hourlyPrice: 0, monthlyPrice: 0 };
  };

  const plansPricing: TRancherPricing[] = [
    getRancherPrice(RancherPlanCode.OVHCLOUD_EDITION),
    getRancherPrice(RancherPlanCode.STANDARD),
  ];

  return { plansPricing, isLoading, isError };
};
