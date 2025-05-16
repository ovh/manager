export const subRoutes = {
  root: '/ip',
  onboarding: 'onboarding',
  order: 'order',
  byoip: 'byoip',
  manageOrganisations: 'manage-organisations',
  openOrganisations: 'open',
};

export const urlDynamicParts = {
  id: ':id',
  organisationId: ':organisationId',
};

export const urls = {
  root: subRoutes.root,
  onboarding: `${subRoutes.root}/${subRoutes.onboarding}`,
  listing: subRoutes.root,
  order: `${subRoutes.root}/${subRoutes.order}`,
  byoip: `${subRoutes.root}/${subRoutes.byoip}`,
  manageOrganisations: `${subRoutes.root}/${subRoutes.manageOrganisations}`,
  openOrganisationsModel: `${subRoutes.root}/${subRoutes.manageOrganisations}/${urlDynamicParts.organisationId}/${subRoutes.openOrganisations}`,
  configureReverseDns: `${subRoutes.root}/modify-reverse-dns/${urlDynamicParts.id}`,
};
