import ai from '@/types/AI';
import { ImagePartnerApp } from '@/types/orderFunnel';

export const mockedPartner: ai.partner.Partner = {
  createdAt: '2020/02/01',
  description: 'lettri',
  id: 'lettria',
  name: 'Lettria',
};

export const mockedContract: ai.partner.Contract = {
  termsOfService: { fr_fr: { url: 'myurl' } },
  signedAt: '2020/02/02',
};

export const mockedPartnerImagePerApp: ImagePartnerApp = {
  description: 'lettria',
  docUrl: 'https://docs.url',
  id: 'sentiment-analysis-app',
  licensing: ai.capabilities.LicensingTypeEnum['per-app'],
  logoUrl: 'logoUrl',
  name: 'sentiment-analysis-app',
  partnerId: 'lettria',
  partnerName: 'Lettria',
  versions: ['1'],
  pricingCpu: {
    price: 2,
    tax: 1,
  },
  pricingGpu: {
    price: 2,
    tax: 1,
  },
};

export const mockedPartnerSignedImagePerReplica: ImagePartnerApp = {
  ...mockedPartnerImagePerApp,
  licensing: ai.capabilities.LicensingTypeEnum['per-replica'],
  contract: {
    termsOfService: { fr_fr: { url: 'https.tesst.com' } },
    signedAt: '2020/20/02',
  },
};
