export const subRoutes = {
  root: '/ip',
  onboarding: 'onboarding',
  order: 'order',
  byoip: 'byoip',
};

export const urls = {
  root: subRoutes.root,
  onboarding: `${subRoutes.root}/${subRoutes.onboarding}`,
  listing: `${subRoutes.root}`,
  order: `${subRoutes.root}/${subRoutes.order}`,
  byoip: `${subRoutes.root}/${subRoutes.byoip}`,
};
