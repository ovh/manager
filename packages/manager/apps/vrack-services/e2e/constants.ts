import { config } from '../../../../../playwright-helpers/config';

export const urls = {
  app: config.appUrl,
  onboarding: `${config.appUrl}#/onboarding`,
  create: `${config.appUrl}#/create`,
  listing: `${config.appUrl}#/`,
};

export default urls;
