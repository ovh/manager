export const urls = {
  root: '/',

  onboarding: '/onboarding',
  createVrackServices: '/create',
  createConfirm: '/create/confirm/:region',
  listing: '/',
  listingAssociate: '/associate/:id',
  listingDissociate: '/dissociate/:id/:vrackId',
  listingDelete: '/delete/:id',
  listingEdit: '/edit/:id',
  listingAssociateAnother: '/associate-another/:id/:vrackId',

  dashboard: '/:id',
  overview: '/:id',
  overviewAssociate: '/:id/associate',
  overviewDissociate: '/:id/dissociate/:vrackId',
  overviewEdit: '/:id/edit',
  overviewDelete: '/:id/delete',
  overviewAssociateAnother: '/:id/associate-another/:vrackId',

  subnets: '/:id/subnets',
  subnetsOnboarding: '/:id/subnets/onboarding',
  subnetsListing: '/:id/subnets/listing',
  subnetsEdit: '/:id/subnets/listing/edit/:cidr',
  subnetsDelete: '/:id/subnets/listing/delete/:cidr',
  createSubnet: '/:id/createsubnet',

  endpoints: '/:id/endpoints',
  endpointsOnboarding: '/:id/endpoints/onboarding',
  endpointsListing: '/:id/endpoints/listing',
  endpointsDelete: '/:id/endpoints/listing/delete/:urn',
  createEndpoint: '/:id/createendpoint',
};
