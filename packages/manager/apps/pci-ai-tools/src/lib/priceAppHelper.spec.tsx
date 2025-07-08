import {
  mockedOrderFlavorCPU,
  mockedOrderFlavorGPU,
} from '@/__tests__/helpers/mocks/capabilities/flavor';
import { AppGlobalPricing } from '@/types/orderFunnel';
import { createAppPriceObject } from './priceAppHelper';
import {
  mockedPartnerImagePerApp,
  mockedPartnerSignedImagePerReplica,
} from '@/__tests__/helpers/mocks/partner/partner';
import { mockedOrderScaling } from '@/__tests__/helpers/mocks/app/appHelper';
import ai from '@/types/AI';

const imagePartInput = {
  name: 'sentiment-analysis-app',
  version: '1',
};

describe('priceAppHelper', () => {
  it('createAppPriceObject without licencing', () => {
    const imageInput = {
      name: 'test',
      version: '',
    };
    const pricingResult: AppGlobalPricing = {
      resourcePricing: {
        price: 180,
        tax: 180,
      },
      scalingPricing: {
        price: 180,
        tax: 180,
      },
    };
    expect(
      createAppPriceObject(
        imageInput,
        [mockedPartnerImagePerApp],
        mockedOrderScaling,
        mockedOrderFlavorCPU,
        3,
      ),
    ).toStrictEqual(pricingResult);
  });

  it('createAppPriceObject with licencing per app', () => {
    const pricingResult: AppGlobalPricing = {
      partnerLicence: {
        price: 2,
        tax: 1,
      },
      resourcePricing: {
        price: 180,
        tax: 180,
      },
      scalingPricing: {
        price: 180,
        tax: 180,
      },
    };
    expect(
      createAppPriceObject(
        imagePartInput,
        [mockedPartnerImagePerApp],
        { ...mockedOrderScaling, autoScaling: false },
        mockedOrderFlavorCPU,
        3,
      ),
    ).toStrictEqual(pricingResult);
  });

  it('createAppPriceObject with licencing per resource per CPU', () => {
    const pricingResult: AppGlobalPricing = {
      partnerLicence: {
        price: 720,
        tax: 360,
      },
      resourcePricing: {
        price: 180,
        tax: 180,
      },
      scalingPricing: {
        price: 180,
        tax: 180,
      },
    };
    expect(
      createAppPriceObject(
        imagePartInput,
        [
          {
            ...mockedPartnerImagePerApp,
            licensing: ai.capabilities.LicensingTypeEnum['per-resource'],
          },
        ],
        mockedOrderScaling,
        mockedOrderFlavorCPU,
        3,
      ),
    ).toStrictEqual(pricingResult);
  });

  it('createAppPriceObject with licencing per resource per GPU', () => {
    const pricingResult: AppGlobalPricing = {
      partnerLicence: {
        price: 720,
        tax: 360,
      },
      resourcePricing: {
        price: 180,
        tax: 180,
      },
      scalingPricing: {
        price: 180,
        tax: 180,
      },
    };
    expect(
      createAppPriceObject(
        imagePartInput,
        [
          {
            ...mockedPartnerImagePerApp,
            licensing: ai.capabilities.LicensingTypeEnum['per-resource'],
          },
        ],
        mockedOrderScaling,
        mockedOrderFlavorGPU,
        3,
      ),
    ).toStrictEqual(pricingResult);
  });

  it('createAppPriceObject with licencing per replica per GPU', () => {
    const pricingResult: AppGlobalPricing = {
      partnerLicence: {
        price: 4,
        tax: 2,
      },
      resourcePricing: {
        price: 180,
        tax: 180,
      },
      scalingPricing: {
        price: 180,
        tax: 180,
      },
    };
    expect(
      createAppPriceObject(
        imagePartInput,
        [mockedPartnerSignedImagePerReplica],
        mockedOrderScaling,
        mockedOrderFlavorGPU,
        3,
      ),
    ).toStrictEqual(pricingResult);
  });

  it('createAppPriceObject with licencing per replica per CPU', () => {
    const pricingResult: AppGlobalPricing = {
      partnerLicence: {
        price: 4,
        tax: 2,
      },
      resourcePricing: {
        price: 180,
        tax: 180,
      },
      scalingPricing: {
        price: 180,
        tax: 180,
      },
    };
    expect(
      createAppPriceObject(
        imagePartInput,
        [mockedPartnerSignedImagePerReplica],
        mockedOrderScaling,
        mockedOrderFlavorCPU,
        3,
      ),
    ).toStrictEqual(pricingResult);
  });

  it('createAppPriceObject with licencing per second bracket per CPU', () => {
    const pricingResult: AppGlobalPricing = {
      partnerLicence: {
        price: 120,
        tax: 60,
      },
      resourcePricing: {
        price: 180,
        tax: 180,
      },
      scalingPricing: {
        price: 180,
        tax: 180,
      },
    };
    expect(
      createAppPriceObject(
        imagePartInput,
        [
          {
            ...mockedPartnerImagePerApp,
            licensing: ai.capabilities.LicensingTypeEnum['per-second-bracket'],
          },
        ],
        mockedOrderScaling,
        mockedOrderFlavorCPU,
        3,
      ),
    ).toStrictEqual(pricingResult);
  });

  it('createAppPriceObject with licencing per second bracket per GPU', () => {
    const imageInput = {
      name: 'sentiment-analysis-app',
      version: '1',
    };
    const pricingResult: AppGlobalPricing = {
      partnerLicence: {
        price: 120,
        tax: 60,
      },
      resourcePricing: {
        price: 180,
        tax: 180,
      },
      scalingPricing: {
        price: 180,
        tax: 180,
      },
    };
    expect(
      createAppPriceObject(
        imageInput,
        [
          {
            ...mockedPartnerImagePerApp,
            licensing: ai.capabilities.LicensingTypeEnum['per-second-bracket'],
          },
        ],
        mockedOrderScaling,
        mockedOrderFlavorGPU,
        3,
      ),
    ).toStrictEqual(pricingResult);
  });
});
