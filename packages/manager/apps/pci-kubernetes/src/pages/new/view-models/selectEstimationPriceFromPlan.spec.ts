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

  const nodePools = [
    { monthlyPrice: 100, desiredNodes: 2 },
    { monthlyPrice: 200, desiredNodes: 3 },
  ] as NodePoolPrice[];
  const nodePoolsWithFloatingIp = [
    { monthlyPrice: 100, attachFloatingIps: { enabled: true }, desiredNodes: 1 },
    { monthlyPrice: 200, attachFloatingIps: { enabled: false }, desiredNodes: 2 },
  ] as NodePoolPrice[];

  it.each([
    {
      description: 'FREE plan with showSavingPlan = true 3AZ = true (default test)',
      plan: TClusterPlanEnum.FREE,
      pools: [] as NodePoolPrice[],
      options: { has3AZ: true, showSavingPlan: true },
      expected: {
        showSavingPlan: true,
        clusterShow: true,
        cluster: 'kube_common_estimation_price_free',
        node: '0 €/mo',
        floatingIpShow: false,
        totalShow: true,
        total: '0 €/mo',
      },
    },
    {
      description: 'FREE plan with showSavingPlan = false, 3AZ = true',
      plan: TClusterPlanEnum.FREE,
      pools: [] as NodePoolPrice[],
      options: { has3AZ: true, showSavingPlan: false },
      expected: {
        showSavingPlan: false,
        clusterShow: true,
        cluster: 'kube_common_estimation_price_free',
        node: '0 €/mo',
        floatingIpShow: false,
        totalShow: true,
        total: '0 €/mo',
      },
    },
    {
      description: 'FREE plan with has3AZ = false',
      plan: TClusterPlanEnum.FREE,
      pools: [] as NodePoolPrice[],
      options: { has3AZ: false, showSavingPlan: true },
      expected: {
        showSavingPlan: true,
        clusterShow: false,
        cluster: 'kube_common_estimation_price_free',
        node: '0 €/mo',
        floatingIpShow: false,
        totalShow: false,
        total: '0 €/mo',
      },
    },
    {
      description: 'FREE plan with has3AZ = false showSavingPlan = false',
      plan: TClusterPlanEnum.FREE,
      pools: [] as NodePoolPrice[],
      options: { has3AZ: false, showSavingPlan: false },
      expected: {
        showSavingPlan: false,
        clusterShow: false,
        cluster: 'kube_common_estimation_price_free',
        node: '0 €/mo',
        floatingIpShow: false,
        totalShow: false,
        total: '0 €/mo',
      },
    },
    {
      description: 'STANDARD plan with has3AZ = false SavingPlan = false',
      plan: TClusterPlanEnum.STANDARD,
      pools: nodePools,
      options: { has3AZ: false, showSavingPlan: false },
      expected: {
        showSavingPlan: false,
        clusterShow: false,
        cluster: '720 €/mo',
        node: '300 €/mo',
        floatingIpShow: false,
        totalShow: false,
        total: '1020 €/mo',
      },
    },
    {
      description: 'STANDARD plan with showSavingPlan = true and has3AZ = true',
      plan: TClusterPlanEnum.STANDARD,
      pools: nodePools,
      options: { has3AZ: true, showSavingPlan: true },
      expected: {
        showSavingPlan: true,
        clusterShow: true,
        cluster: '720 €/mo',
        node: '300 €/mo',
        floatingIpShow: false,
        totalShow: true,
        total: '1020 €/mo',
      },
    },
    {
      description: 'STANDARD plan with showSavingPlan = true and has3AZ = false',
      plan: TClusterPlanEnum.STANDARD,
      pools: nodePools,
      options: { has3AZ: false, showSavingPlan: true },
      expected: {
        showSavingPlan: true,
        clusterShow: false,
        cluster: '720 €/mo',
        node: '300 €/mo',
        floatingIpShow: false,
        totalShow: false,
        total: '1020 €/mo',
      },
    },
    {
      description: 'STANDARD plan with showSavingPlan = false and has3AZ = true',
      plan: TClusterPlanEnum.STANDARD,
      pools: nodePools,
      options: { has3AZ: true, showSavingPlan: false },
      expected: {
        showSavingPlan: false,
        clusterShow: true,
        cluster: '720 €/mo',
        node: '300 €/mo',
        floatingIpShow: false,
        totalShow: true,
        total: '1020 €/mo',
      },
    },
    {
      description: 'STANDARD plan with floating IP enabled',
      plan: TClusterPlanEnum.STANDARD,
      pools: nodePoolsWithFloatingIp,
      options: { has3AZ: true, showSavingPlan: true, priceFloatingIp: 10 },
      expected: {
        showSavingPlan: true,
        clusterShow: true,
        cluster: '720 €/mo',
        node: '300 €/mo',
        floatingIpShow: true,
        floatingIp: '10 €/mo',
        totalShow: true,
        total: '1030 €/mo',
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

      expect(rows).toHaveLength(6);
      // saving plan row
      expect(rows[0]?.show).toBe(expected.showSavingPlan);
      expect(rows[0]?.label).toBe('kube_common_node_pool_estimation_text');
      // cluster row
      expect(rows[1]?.show).toBe(expected.clusterShow);
      if (rows[1]?.show) {
        expect(rows[1]?.value).toBe(expected.cluster);
      }
      // node pool row
      expect(rows[2]?.show).toBe(true);
      expect(rows[2]?.value).toBe(expected.node);
      // floating IP row
      expect(rows[3]?.show).toBe(expected.floatingIpShow);

      if (rows[3]?.show && expected.floatingIp) {
        expect(rows[3].value).toBe(expected.floatingIp);
      }
      // total row
      expect(rows[4]?.show).toBe(expected.totalShow);
      if (rows[4]?.show) {
        expect(rows[4].value).toBe(expected.total);
      }
      // end text row
      expect(rows[5]?.show).toBe(true);
      expect(rows[5]?.label).toBe('kube_common_node_pool_estimation_text_end');
    },
  );
});
