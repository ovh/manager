import { mockedCapabilitiesFlavorCPU } from '@/__tests__/helpers/mocks/flavor';
import { createFlavorPricingList, getFlavorPricing } from './priceFlavorHelper';
import { mockedCatalog } from '@/__tests__/helpers/mocks/catalog';
import { AppPricing, Flavor } from '@/types/orderFunnel';
import { order } from '@/types/catalog';

describe('priceFlavorHelper', () => {
  it('createFlavorPricingList', () => {
    const flavorWithPricing: Flavor = {
      ...mockedCapabilitiesFlavorCPU,
      pricing: [
        {
          capacities: [
            order.cart.GenericProductPricingCapacitiesEnum.consumption,
          ],
          commitment: 1,
          description: 'description',
          interval: 2,
          intervalUnit: order.cart.DurationUnitEnum.day,
          mode: 'mode',
          mustBeCompleted: true,
          phase: 14,
          price: 1,
          quantity: { min: 1 },
          repeat: { min: 1 },
          strategy: order.cart.GenericProductPricingStrategyEnum.stairstep,
          tax: 1,
          type: order.cart.GenericProductPricingTypeEnum.consumption,
        },
      ],
    };
    expect(
      createFlavorPricingList(
        [mockedCapabilitiesFlavorCPU],
        mockedCatalog,
        'ai-notebook',
      ),
    ).toStrictEqual([flavorWithPricing]);
  });

  it('getFlavorPricing', () => {
    const pricingFlavor: AppPricing = {
      price: 1,
      tax: 1,
    };
    expect(
      getFlavorPricing(
        mockedCapabilitiesFlavorCPU.id,
        mockedCatalog,
        'ai-notebook',
      ),
    ).toStrictEqual(pricingFlavor);
  });
});
