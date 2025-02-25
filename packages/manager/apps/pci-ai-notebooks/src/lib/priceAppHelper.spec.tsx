import {
  mockedOrderFlavorCPU,
  mockedOrderFlavorGPU,
} from '@/__tests__/helpers/mocks/flavor';
import { AppGlobalPricing } from '@/types/orderFunnel';
import { createAppPriceObject } from './priceAppHelper';
import {
  mockedPartnerImage,
  mockedPartnerImageBis,
} from '@/__tests__/helpers/mocks/partnerAppImage';
import { mockedScaling } from '@/__tests__/helpers/mocks/app';
import * as ai from '@/types/cloud/project/ai';

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
        [mockedPartnerImage],
        mockedScaling,
        mockedOrderFlavorCPU,
        3,
      ),
    ).toStrictEqual(pricingResult);
  });

  it('createAppPriceObject with licencing per app', () => {
    const imageInput = {
      name: 'idImage1',
      version: '1',
    };
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
        imageInput,
        [mockedPartnerImage],
        { ...mockedScaling, autoScaling: false },
        mockedOrderFlavorCPU,
        3,
      ),
    ).toStrictEqual(pricingResult);
  });

  it('createAppPriceObject with licencing per resource per CPU', () => {
    const imageInput = {
      name: 'idImage1',
      version: '1',
    };
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
        imageInput,
        [
          {
            ...mockedPartnerImage,
            licensing: ai.capabilities.LicensingTypeEnum['per-resource'],
          },
        ],
        mockedScaling,
        mockedOrderFlavorCPU,
        3,
      ),
    ).toStrictEqual(pricingResult);
  });

  it('createAppPriceObject with licencing per resource per GPU', () => {
    const imageInput = {
      name: 'idImage1',
      version: '1',
    };
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
        imageInput,
        [
          {
            ...mockedPartnerImage,
            licensing: ai.capabilities.LicensingTypeEnum['per-resource'],
          },
        ],
        mockedScaling,
        mockedOrderFlavorGPU,
        3,
      ),
    ).toStrictEqual(pricingResult);
  });

  it('createAppPriceObject with licencing per replica per GPU', () => {
    const imageInput = {
      name: 'identifImage2',
      version: '1',
    };
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
        imageInput,
        [mockedPartnerImageBis],
        mockedScaling,
        mockedOrderFlavorGPU,
        3,
      ),
    ).toStrictEqual(pricingResult);
  });

  it('createAppPriceObject with licencing per replica per CPU', () => {
    const imageInput = {
      name: 'identifImage2',
      version: '1',
    };
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
        imageInput,
        [mockedPartnerImageBis],
        mockedScaling,
        mockedOrderFlavorCPU,
        3,
      ),
    ).toStrictEqual(pricingResult);
  });

  it('createAppPriceObject with licencing per second bracket per CPU', () => {
    const imageInput = {
      name: 'idImage1',
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
            ...mockedPartnerImage,
            licensing: ai.capabilities.LicensingTypeEnum['per-second-bracket'],
          },
        ],
        mockedScaling,
        mockedOrderFlavorCPU,
        3,
      ),
    ).toStrictEqual(pricingResult);
  });

  it('createAppPriceObject with licencing per second bracket per GPU', () => {
    const imageInput = {
      name: 'idImage1',
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
            ...mockedPartnerImage,
            licensing: ai.capabilities.LicensingTypeEnum['per-second-bracket'],
          },
        ],
        mockedScaling,
        mockedOrderFlavorGPU,
        3,
      ),
    ).toStrictEqual(pricingResult);
  });
});
