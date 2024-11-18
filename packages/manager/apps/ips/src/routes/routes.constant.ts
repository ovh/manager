export const subRoutes = {
  root: '/ip',
  onboarding: 'onboarding',
  order: 'order',
};

export const urls = {
  root: subRoutes.root,
  onboarding: `${subRoutes.root}/${subRoutes.onboarding}`,
  listing: `${subRoutes.root}`,
};
