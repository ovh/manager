export const urls = {
  root: '/',
  listing: '/',
  associate: '/:id/associate',
  onboarding: '/onboarding',
  createVrackServices: '/create',
  dashboard: '/:id',
  overview: '/:id',
  subnets: '/:id/subnets',
  createSubnet: '/:id/createsubnet',
  endpoints: '/:id/endpoints',
  createEndpoint: '/:id/createendpoint',
};

export const pageTrackingLabels = {
  [urls.associate]: 'pop-up::associate',
  [urls.listing]: 'listing',
  [urls.overview]: 'general_informations',
  [urls.subnets]: 'subnets',
  [urls.endpoints]: 'endpoints',
  [urls.createEndpoint]: 'endpoints::add',
  [urls.createSubnet]: 'subnets::add',
  [urls.createVrackServices]: 'add',
};
