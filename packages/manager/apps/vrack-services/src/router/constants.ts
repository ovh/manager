export const urls = {
  root: '/',

  onboarding: '/onboarding',
  createVrackServices: '/create',
  createConfirm: '/create/confirm/:region',
  listing: '/',
  listingAssociate: '/associate/:id',
  listingDelete: '/delete/:id',

  dashboard: '/:id',
  overview: '/:id',
  overviewAssociate: '/:id/associate',
  overviewDissociate: '/:id/dissociate/:vrackId',

  subnets: '/:id/subnets',
  subnetsOnboarding: '/:id/subnets/onboarding',
  subnetsListing: '/:id/subnets/listing',
  subnetsDelete: '/:id/subnets/listing/delete/:cidr',
  createSubnet: '/:id/createsubnet',

  endpoints: '/:id/endpoints',
  endpointsOnboarding: '/:id/endpoints/onboarding',
  endpointsListing: '/:id/endpoints/listing',
  endpointsDelete: '/:id/endpoints/listing/delete/:urn',
  createEndpoint: '/:id/createendpoint',
};
