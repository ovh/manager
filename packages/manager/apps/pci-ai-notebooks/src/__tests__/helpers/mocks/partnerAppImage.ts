import { ImagePartnerApp } from '@/types/orderFunnel';
import * as ai from '@/types/cloud/project/ai';

export const mockedPartnerImage: ImagePartnerApp = {
  description: 'image1',
  docUrl: 'docUrl1',
  id: 'idImage1',
  licensing: ai.capabilities.LicensingTypeEnum['per-app'],
  logoUrl: 'logoUrl',
  name: 'imageName1',
  partnerId: 'partnerId1',
  partnerName: 'partnerName1',
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

export const mockedPartnerImageBis: ImagePartnerApp = {
  ...mockedPartnerImage,
  description: 'image2',
  docUrl: 'docUrl2',
  id: 'identifImage2',
  licensing: ai.capabilities.LicensingTypeEnum['per-replica'],
  logoUrl: 'logoUrl',
  name: 'imageName2',
  partnerId: 'partnerId2',
  partnerName: 'partnerName2',
  contract: {
    termsOfService: { fr_fr: { url: 'https.tesst.com' } },
    signedAt: '2020/20/02',
  },
};

export const mockedPartner: ai.partner.Partner = {
  createdAt: '2020/02/01',
  description: 'partnerDesc',
  id: 'partnerId',
  name: 'partnerName',
};

export const mockedContract: ai.partner.Contract = {
  termsOfService: { fr_fr: { url: 'myurl' } },
  signedAt: '2020/02/02',
};
