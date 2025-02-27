import { mockedCapabilitiesFlavorCPU } from '@/__tests__/helpers/mocks/capabilities/flavor';
import { createFlavorPricingList, getFlavorPricing } from './priceFlavorHelper';
import {
  mockedCatalog,
  mockedPricing,
} from '@/__tests__/helpers/mocks/catalog/catalog';
import { AppPricing, Flavor } from '@/types/orderFunnel';

describe('priceFlavorHelper', () => {
  it('createFlavorPricingList', () => {
    const flavorWithPricing: Flavor = {
      ...mockedCapabilitiesFlavorCPU,
      pricing: [mockedPricing],
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
