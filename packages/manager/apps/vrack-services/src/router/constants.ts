export const urls = {
  root: '/',
  listing: '/',
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
  [urls.listing]: 'listing',
  [urls.overview]: 'dashboard',
  [urls.subnets]: 'subnets',
  [urls.endpoints]: 'endpoints',
  [urls.createEndpoint]: 'endpoints::add',
  [urls.createSubnet]: 'subnets::add',
  [urls.createVrackServices]: 'add',
};
