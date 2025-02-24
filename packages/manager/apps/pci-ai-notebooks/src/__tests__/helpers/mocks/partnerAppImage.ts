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
    price: 0.0021,
    tax: 0.001,
  },
  pricingGpu: {
    price: 0.0042,
    tax: 0.002,
  },
};

export const mockedPartnerImageBis: ImagePartnerApp = {
  description: 'image2',
  docUrl: 'docUrl2',
  id: 'idImage2',
  licensing: ai.capabilities.LicensingTypeEnum['per-replica'],
  logoUrl: 'logoUrl',
  name: 'imageName2',
  partnerId: 'partnerId2',
  partnerName: 'partnerName2',
  ...mockedPartnerImage,
};
