import * as ai from '@/types/cloud/project/ai';

export const mockedCapaAppImage: ai.capabilities.app.Image = {
  description: 'description',
  docUrl: 'docUrl',
  id: 'mockedImagepartnerId',
  licensing: ai.capabilities.LicensingTypeEnum['per-app'],
  logoUrl: 'logUrl',
  name: 'capaImageName',
  partnerId: 'partnerId',
  partnerName: 'partnerName',
  versions: ['1', '2'],
};
