import { RancherPlanCode, RancherPlanName } from '@/types/api.type';
import {
  findPlanByCode,
  isConsumptionPlan,
  getRancherPlanName,
  getPlanPricing,
} from './rancherPrices';
import { mockCatalog } from '@/_mock_/catalog';

describe('Rancher Prices Utilities', () => {
  const EXPECTED_MONTHLY_PRICING = 73_000;
  describe('findPlanByCode', () => {
    it('should find a plan by its code', () => {
      const result = findPlanByCode(
        mockCatalog,
        RancherPlanCode.OVHCLOUD_EDITION,
      );
      expect(result).toEqual(mockCatalog.addons[0]);
    });

    it('should return undefined when plan not found', () => {
      const result = findPlanByCode(
        mockCatalog,
        'non-existent' as RancherPlanCode,
      );
      expect(result).toBeUndefined();
    });
  });

  describe('isConsumptionPlan', () => {
    it('should return true for consumption-based plans', () => {
      const result = isConsumptionPlan(mockCatalog.addons[0]);
      expect(result).toBe(true);
    });

    it('should return false for non-consumption plans', () => {
      const result = isConsumptionPlan(mockCatalog.addons[1]);
      expect(result).toBe(false);
    });
  });

  describe('getRancherPlanName', () => {
    it('should return OVHCLOUD_EDITION for ovhcloud plans', () => {
      const result = getRancherPlanName(RancherPlanCode.OVHCLOUD_EDITION);
      expect(result).toBe(RancherPlanName.OVHCLOUD_EDITION);
    });

    it('should return STANDARD for standard plans', () => {
      const result = getRancherPlanName(RancherPlanCode.STANDARD);
      expect(result).toBe(RancherPlanName.STANDARD);
    });
  });

  describe('getPlanPricing', () => {
    it('should calculate EXPECTED_MONTHLY_PRICING correctly for OVHCLOUD_EDITION', () => {
      const result = getPlanPricing(
        mockCatalog,
        RancherPlanCode.OVHCLOUD_EDITION,
      );
      expect(result).toEqual({
        name: RancherPlanName.OVHCLOUD_EDITION,
        hourlyPrice: 100,
        monthlyPrice: EXPECTED_MONTHLY_PRICING,
      });
    });

    it('should not handle non-consumption plans', () => {
      const result = getPlanPricing(mockCatalog, RancherPlanCode.STANDARD);
      expect(result).toEqual({
        name: RancherPlanName.STANDARD,
        hourlyPrice: 0,
        monthlyPrice: 0,
      });
    });

    it('should return zero prices for invalid plan codes', () => {
      const result = getPlanPricing(
        mockCatalog,
        'non-existent' as RancherPlanCode,
      );
      expect(result).toEqual({
        name: RancherPlanName.STANDARD,
        hourlyPrice: 0,
        monthlyPrice: 0,
      });
    });
  });
});
