import * as ai from '@datatr-ux/ovhcloud-types/cloud/project/ai/index';

export const mockedCapaAppImagePerApp: ai.capabilities.app.Image = {
  description: 'image pour analyse de sentiment',
  docUrl: 'https://myDoc.com',
  id: 'sentiment-analysis-app',
  licensing: ai.capabilities.LicensingTypeEnum['per-app'],
  logoUrl: 'https://logo.com',
  name: 'sentiment-analysis',
  partnerId: 'lettria',
  partnerName: 'Lettria',
  versions: ['le-cpu', 'le-gpu'],
};

export const mockedCapaAppImagePerBracket: ai.capabilities.app.Image = {
  ...mockedCapaAppImagePerApp,
  licensing: ai.capabilities.LicensingTypeEnum['per-second-bracket'],
};
