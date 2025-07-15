import { getPlanPricing } from './utils';
import { TPricingInfo } from '@/hooks/useCatalogCommercial';

describe('getPlanPricing', () => {
  it('should calculate pricing fields correctly', () => {
    const pricing: TPricingInfo = {
      id: '1',
      code: 'test',
      duration: 6,
      price: 23.715,
    };
    const quantity = 1;
    const hourlyPriceWithoutDiscount = 0.0465;

    const result = getPlanPricing({
      pricing,
      quantity,
      hourlyPriceWithoutDiscount,
    });

    expect(result).toEqual({
      ...pricing,
      monthlyPercentageDiscount: '30',
      monthlyPrice: 2371500000,
      monthlyPriceWithoutDiscount: 3394500000,
    });
  });
});
