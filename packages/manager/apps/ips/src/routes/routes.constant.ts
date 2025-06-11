export const subRoutes = {
  root: '/ip',
  onboarding: 'onboarding',
  order: 'order',
  byoip: 'byoip',
  configureReverseDns: 'configure-reverse-dns',
  manageOrganisations: 'manage-organisations',
  openOrganisations: 'open',
  byoipOrder: 'byoip-order',
  terminate: 'terminate',
  upsertDescription: 'upsert-description',
  configureGameFirewall: 'game-firewal',
};

export const urlDynamicParts = {
  parentId: ':parentId',
  id: ':id',
  optionalId: ':id?',
  organisationId: ':organisationId',
};

export const urls = {
  root: subRoutes.root,
  onboarding: `${subRoutes.root}/${subRoutes.onboarding}`,
  listing: subRoutes.root,
  listingTerminate: `${subRoutes.root}/${subRoutes.terminate}/${urlDynamicParts.id}`,
  listingUpsertDescription: `${subRoutes.root}/${subRoutes.upsertDescription}/${urlDynamicParts.id}`,
  listingConfigureGameFirewall: `${subRoutes.root}/${urlDynamicParts.id}/${subRoutes.configureGameFirewall}`,
  order: `${subRoutes.root}/${subRoutes.order}`,
  byoip: `${subRoutes.root}/${subRoutes.byoip}`,
  manageOrganisations: `${subRoutes.root}/${subRoutes.manageOrganisations}`,
  openOrganisationsModal: `${subRoutes.root}/${subRoutes.manageOrganisations}/${urlDynamicParts.organisationId}/${subRoutes.openOrganisations}`,
  listingConfigureReverseDns: `${subRoutes.root}/${subRoutes.configureReverseDns}/${urlDynamicParts.parentId}/${urlDynamicParts.optionalId}`,
  byoipOrderModal: `${subRoutes.root}/${subRoutes.byoip}/${subRoutes.byoipOrder}`,
};
