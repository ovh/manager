import { mockedCatalog } from '@/__tests__/helpers/mocks/catalog/catalog';
import { createAppImagePricingList } from './pricePartnerImageHelper';

import {
  mockedContract,
  mockedPartner,
} from '@/__tests__/helpers/mocks/partner/partner';
import { ImagePartnerApp } from '@/types/orderFunnel';
import {
  mockedCapaAppImagePerApp,
  mockedCapaAppImagePerBracket,
} from '@/__tests__/helpers/mocks/capabilities/partnerAppImage';
import { mockedAppPricing1 } from '@/__tests__/helpers/mocks/app/appHelper';

describe('pricePartnerImageHelper', () => {
  it('createAppImagePricingList', () => {
    const appImage: ImagePartnerApp = {
      ...mockedCapaAppImagePerApp,
      contract: mockedContract,
      pricingCpu: mockedAppPricing1,
      pricingGpu: mockedAppPricing1,
    };
    expect(
      createAppImagePricingList(
        [mockedCapaAppImagePerApp],
        [{ ...mockedPartner, contract: mockedContract }],
        mockedCatalog,
      ),
    ).toStrictEqual([appImage]);
  });

  it('createAppImagePricingList with second bracket consumption', () => {
    const appImage: ImagePartnerApp = {
      ...mockedCapaAppImagePerBracket,
      contract: mockedContract,
      pricingCpu: {
        price: mockedAppPricing1.price * 60,
        tax: mockedAppPricing1.tax * 60,
      },
      pricingGpu: {
        price: mockedAppPricing1.price * 60,
        tax: mockedAppPricing1.tax * 60,
      },
    };
    expect(
      createAppImagePricingList(
        [mockedCapaAppImagePerBracket],
        [{ ...mockedPartner, contract: mockedContract }],
        mockedCatalog,
      ),
    ).toStrictEqual([appImage]);
  });

  it('createAppImagePricingList without price found', () => {
    const appImage: ImagePartnerApp = {
      ...mockedCapaAppImagePerApp,
      id: 'testabc',
      contract: mockedContract,
      pricingCpu: {
        price: NaN,
        tax: NaN,
      },
      pricingGpu: {
        price: NaN,
        tax: NaN,
      },
    };
    expect(
      createAppImagePricingList(
        [{ ...mockedCapaAppImagePerApp, id: 'testabc' }],
        [{ ...mockedPartner, contract: mockedContract }],
        mockedCatalog,
      ),
    ).toStrictEqual([appImage]);
  });
});
