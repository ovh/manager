import { useCatalog } from '@ovh-ux/manager-pci-common';
import { RancherPlanCode, TRancherPricing } from '@/types/api.type';
import { getPlanPricing } from '@/utils/rancherPrices';

export const useRancherPrices = () => {
  const { data: catalog, isLoading, isError } = useCatalog();

  const plansPricing: TRancherPricing[] = [
    getPlanPricing(catalog, RancherPlanCode.OVHCLOUD_EDITION),
    getPlanPricing(catalog, RancherPlanCode.STANDARD),
  ];

  return { plansPricing, isLoading, isError };
};
