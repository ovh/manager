import { mockServiceConsumption } from '@/mocks/services/consumptions';

import { selectConsumptionPriceText, selectConsumptionQuantity } from '../consumption.selectors';

const consumptionsWithoutVaultPlan = mockServiceConsumption.filter(
  (c) => c.planCode !== 'backup-vault-paygo-consumption',
);

describe('consumption.selectors', () => {
  describe('selectConsumptionQuantity', () => {
    it('returns the quantity for VAULT_PLAN_CODE', () => {
      expect(selectConsumptionQuantity(mockServiceConsumption)).toBe(500);
    });

    it('returns 0 when no matching plan code', () => {
      expect(selectConsumptionQuantity(consumptionsWithoutVaultPlan)).toBe(0);
    });

    it('returns 0 for empty array', () => {
      expect(selectConsumptionQuantity([])).toBe(0);
    });
  });

  describe('selectConsumptionPriceText', () => {
    it('returns the price text for VAULT_PLAN_CODE', () => {
      expect(selectConsumptionPriceText(mockServiceConsumption)).toBe('0.15 €');
    });

    it('returns "-" when no matching plan code', () => {
      expect(selectConsumptionPriceText(consumptionsWithoutVaultPlan)).toBe('-');
    });

    it('returns "-" for empty array', () => {
      expect(selectConsumptionPriceText([])).toBe('-');
    });
  });
});
