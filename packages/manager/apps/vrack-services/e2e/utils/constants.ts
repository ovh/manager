import { config } from '../../../../../../playwright-helpers/config';

export const urls = {
  app: config.appUrl,
  onboarding: `${config.appUrl}#/onboarding`,
  create: `${config.appUrl}#/create`,
  listing: `${config.appUrl}#/`,
  createSubnet: `${config.appUrl}#/createSubnet`,
  createEndpoint: `${config.appUrl}#/createEndpoint`,
  getOverview: (id: string) => `${config.appUrl}#/${id}`,
  getSubnet: (id: string) => `${config.appUrl}#/${id}/Subnets`,
  getEndpoint: (id: string) => `${config.appUrl}#/${id}/Endpoints`,
};

export default urls;
