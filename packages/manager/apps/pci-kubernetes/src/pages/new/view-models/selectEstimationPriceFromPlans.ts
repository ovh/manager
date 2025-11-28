import { NodePoolPrice, TClusterPlan, TClusterPlanEnum, TPlan } from '@/types';

export type EstimationPriceViewModel =
  | {
      label: string;
      value: string;
      show: true;
    }
  | {
      label: string;
      value?: null;
      show: false;
    };

const selectEstimationPriceFromPlans =
  (
    t: (translationKey: string) => string,
    getFormattedMonthlyCatalogPrice: (price: number) => string,
    convertHourlyPriceToMonthly: (price: number) => number,
  ) =>
  (
    plan: TClusterPlan,
    plans: TPlan[],
    nodePools?: NodePoolPrice[] | null,
    options?: {
      has3AZ?: boolean;
      showSavingPlan?: boolean;
      priceFloatingIp?: number | null;
    },
  ): EstimationPriceViewModel[] => {
    const getClusterPlan = () => {
      if (plan === TClusterPlanEnum.FREE) return 0;
      const hourlyPrice = plans.find((pl) => pl.value === plan)?.price ?? 0;
      return convertHourlyPriceToMonthly(hourlyPrice);
    };

    const nodePoolsPrice = nodePools?.reduce((acc, item) => acc + item.monthlyPrice, 0) ?? 0;
    // Floating ip depends on the number of nodes
    const floatingIpPrices =
      options?.priceFloatingIp && nodePools
        ? nodePools.reduce((total, item) => {
            if (item.attachFloatingIPs?.enabled) {
              return total + (options.priceFloatingIp ?? 0) * item.desiredNodes;
            }
            return total;
          }, 0)
        : null;
    const clusterPrice = getClusterPlan();
    const totalPrice = clusterPrice + nodePoolsPrice;

    const estimations: [string, boolean, string?][] = [
      [t('kube_common_node_pool_estimation_text'), options?.showSavingPlan ?? false],
      [
        t('kube_common_cluster_estimation_price'),
        !!options?.has3AZ,
        clusterPrice
          ? getFormattedMonthlyCatalogPrice(clusterPrice)
          : t('kube_common_estimation_price_free'),
      ],
      [
        t('kube_common_node_pool_estimation_price'),
        true,
        getFormattedMonthlyCatalogPrice(nodePoolsPrice),
      ],
      [
        // no translation
        'Floating IPs: ',
        !!floatingIpPrices,
        floatingIpPrices ? getFormattedMonthlyCatalogPrice(floatingIpPrices) : undefined,
      ],
      [
        t('kube_common_estimation_total_price'),
        !!options?.has3AZ,
        getFormattedMonthlyCatalogPrice(totalPrice),
      ],
      [t('kube_common_node_pool_estimation_text_end'), true],
    ];

    return estimations.map(
      ([label, condition, value]): EstimationPriceViewModel =>
        condition ? { show: true, label, value: value ?? '' } : { show: false, label },
    );
  };

export default selectEstimationPriceFromPlans;
