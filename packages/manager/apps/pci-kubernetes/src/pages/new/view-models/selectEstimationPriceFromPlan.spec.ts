import { describe, expect, it } from 'vitest';

import { NodePoolPrice, TClusterPlanEnum, TPlan } from '@/types';

import selectEstimationPriceFromPlans from './selectEstimationPriceFromPlans';

describe('selectEstimationPriceFromPlans', () => {
  const t = (key: string) => key;
  const getFormattedMonthlyCatalogPrice = (price: number) => `${price} €/mo`;
  const convertHourlyPriceToMonthly = (price: number) => price * 720;

  const plans = [
    { value: TClusterPlanEnum.FREE, price: 0 },
    { value: TClusterPlanEnum.STANDARD, price: 1 },
  ] as TPlan[];

  const nodePools = [{ monthlyPrice: 100 }, { monthlyPrice: 200 }] as NodePoolPrice[];
  it.each([
    {
      description: 'FREE plan with showSavingPlan = true 3AZ = true (default test)',
      plan: TClusterPlanEnum.FREE,
      pools: [] as NodePoolPrice[],
      options: { has3AZ: true, showSavingPlan: true },
      expected: {
        clusterShow: true,
        totalShow: true,
        cluster: 'kube_common_estimation_price_free',
        node: '0 €/mo',
        total: '0 €/mo',
        showSavingPlan: true,
      },
    },
    {
      description: 'FREE plan with showSavingPlan = false, 3AZ = true',
      plan: TClusterPlanEnum.FREE,
      pools: [] as NodePoolPrice[],
      options: { has3AZ: true, showSavingPlan: false },
      expected: {
        clusterShow: true,
        totalShow: true,
        cluster: 'kube_common_estimation_price_free',
        node: '0 €/mo',
        total: '0 €/mo',
        showSavingPlan: false,
      },
    },
    {
      description: 'FREE plan with has3AZ = false',
      plan: TClusterPlanEnum.FREE,
      pools: [] as NodePoolPrice[],
      options: { has3AZ: false, showSavingPlan: true },
      expected: {
        clusterShow: false,
        totalShow: false,
        cluster: 'kube_common_estimation_price_free',
        node: '0 €/mo',
        total: '0 €/mo',
        showSavingPlan: true,
      },
    },
    {
      description: 'FREE plan with has3AZ = false showSavingPlan = false',
      plan: TClusterPlanEnum.FREE,
      pools: [] as NodePoolPrice[],
      options: { has3AZ: false, showSavingPlan: false },
      expected: {
        clusterShow: false,
        totalShow: false,
        cluster: 'kube_common_estimation_price_free',
        node: '0 €/mo',
        total: '0 €/mo',
        showSavingPlan: false,
      },
    },
    {
      description: 'STANDARD plan with has3AZ = false SavingPlan = true',
      plan: TClusterPlanEnum.STANDARD,
      pools: nodePools,
      options: { has3AZ: false, showSavingPlan: false },
      expected: {
        clusterShow: false,
        totalShow: false,
        cluster: '720 €/mo',
        node: '300 €/mo',
        total: '1020 €/mo',
        showSavingPlan: false,
      },
    },
    {
      description: 'STANDARD plan with showSavingPlan = true',
      plan: TClusterPlanEnum.STANDARD,
      pools: nodePools,
      options: { has3AZ: true, showSavingPlan: true },
      expected: {
        clusterShow: true,
        totalShow: true,
        cluster: '720 €/mo',
        node: '300 €/mo',
        total: '1020 €/mo',
        showSavingPlan: true,
      },
    },
    {
      description: 'STANDARD plan with showSavingPlan = true',
      plan: TClusterPlanEnum.STANDARD,
      pools: nodePools,
      options: { has3AZ: false, showSavingPlan: true },
      expected: {
        clusterShow: false,
        totalShow: false,
        cluster: '720 €/mo',
        node: '300 €/mo',
        total: '1020 €/mo',
        showSavingPlan: true,
      },
    },
    {
      description: 'STANDARD plan with showSavingPlan = true',
      plan: TClusterPlanEnum.STANDARD,
      pools: nodePools,
      options: { has3AZ: true, showSavingPlan: false },
      expected: {
        clusterShow: true,
        totalShow: true,
        cluster: '720 €/mo',
        node: '300 €/mo',
        total: '1020 €/mo',
        showSavingPlan: false,
      },
    },
  ])(
    '$description | has3AZ=$options.has3AZ | showSavingPlan=$options.showSavingPlan',
    ({ plan, pools, options, expected }) => {
      const rows = selectEstimationPriceFromPlans(
        t,
        getFormattedMonthlyCatalogPrice,
        convertHourlyPriceToMonthly,
      )(plan, plans, pools, options);

      expect(rows).toHaveLength(5);
      expect(rows[0].show).toBe(expected.showSavingPlan);
      // cluster row
      expect(rows[1].value).toBe(expected.cluster);
      expect(rows[1].show).toEqual(expected.clusterShow);
      // node pool row
      expect(rows[2].value).toBe(expected.node);
      // total row
      expect(rows[3].value).toBe(expected.total);
      expect(rows[3].show).toEqual(expected.totalShow);

      expect(rows[4].label).toBe('kube_common_node_pool_estimation_text_end');
    },
  );
});
