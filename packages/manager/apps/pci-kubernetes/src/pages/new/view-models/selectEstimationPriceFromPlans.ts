import { NodePoolPrice, TClusterPlan, TClusterPlanEnum, TPlan } from '@/types';

export type EstimationPriceViewModel = {
  label: string;
  value?: string;
  show: boolean;
};

const selectEstimationPriceFromPlans = (
  t: (translationKey: string) => string,
  getFormattedMonthlyCatalogPrice: (price: number) => string,
  convertHourlyPriceToMonthly: (price: number) => number,
) => (
  plan: TClusterPlan,
  plans: TPlan[],
  nodePools?: NodePoolPrice[] | null,
  options?: { has3AZ?: boolean; showSavingPlan?: boolean },
): EstimationPriceViewModel[] => {
  const getClusterPlan = () => {
    if (plan === TClusterPlanEnum.FREE) return 0;
    const hourlyPrice = plans.find((pl) => pl.value === plan)?.price ?? 0;
    return convertHourlyPriceToMonthly(hourlyPrice);
  };

  const nodePoolsPrice =
    nodePools?.reduce((acc, item) => acc + item.monthlyPrice, 0) ?? 0;
  const clusterPrice = getClusterPlan();
  const totalPrice = clusterPrice + nodePoolsPrice;

  return [
    {
      show: options?.showSavingPlan ?? false,
      label: t('kube_common_node_pool_estimation_text'),
    },
    {
      show: options?.has3AZ ?? false,
      label: t('kube_common_cluster_estimation_price'),
      value: clusterPrice
        ? getFormattedMonthlyCatalogPrice(clusterPrice)
        : t('kube_common_estimation_price_free'),
    },
    {
      show: true,
      label: t('kube_common_node_pool_estimation_price'),
      value: getFormattedMonthlyCatalogPrice(nodePoolsPrice),
    },
    {
      show: options?.has3AZ ?? false,
      label: t('kube_common_estimation_total_price'),
      value: getFormattedMonthlyCatalogPrice(totalPrice),
    },
    {
      show: true,
      label: t('kube_common_node_pool_estimation_text_end'),
    },
  ];
};

export default selectEstimationPriceFromPlans;
