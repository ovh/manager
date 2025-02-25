import { mockedCatalog } from '@/__tests__/helpers/mocks/catalog';
import { createAppImagePricingList } from './pricePartnerImageHelper';
import { mockedCapaAppImage } from '@/__tests__/helpers/mocks/appImage';
import {
  mockedContract,
  mockedPartner,
} from '@/__tests__/helpers/mocks/partnerAppImage';
import { ImagePartnerApp } from '@/types/orderFunnel';
import * as ai from '@/types/cloud/project/ai';

describe('pricePartnerImageHelper', () => {
  it('createAppImagePricingList', () => {
    const appImage: ImagePartnerApp = {
      ...mockedCapaAppImage,
      contract: mockedContract,
      pricingCpu: {
        price: 1,
        tax: 1,
      },
      pricingGpu: {
        price: 1,
        tax: 1,
      },
    };
    expect(
      createAppImagePricingList(
        [mockedCapaAppImage],
        [{ ...mockedPartner, contract: mockedContract }],
        mockedCatalog,
      ),
    ).toStrictEqual([appImage]);
  });

  it('createAppImagePricingList with second bracket consumption', () => {
    const appImage: ImagePartnerApp = {
      ...mockedCapaAppImage,
      licensing: ai.capabilities.LicensingTypeEnum['per-second-bracket'],
      contract: mockedContract,
      pricingCpu: {
        price: 60,
        tax: 60,
      },
      pricingGpu: {
        price: 60,
        tax: 60,
      },
    };
    expect(
      createAppImagePricingList(
        [
          {
            ...mockedCapaAppImage,
            licensing: ai.capabilities.LicensingTypeEnum['per-second-bracket'],
          },
        ],
        [{ ...mockedPartner, contract: mockedContract }],
        mockedCatalog,
      ),
    ).toStrictEqual([appImage]);
  });

  it('createAppImagePricingList without price found', () => {
    const appImage: ImagePartnerApp = {
      ...mockedCapaAppImage,
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
        [{ ...mockedCapaAppImage, id: 'testabc' }],
        [{ ...mockedPartner, contract: mockedContract }],
        mockedCatalog,
      ),
    ).toStrictEqual([appImage]);
  });
});
