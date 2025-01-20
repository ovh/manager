export const subRoutes = {
  root: '/',
  onboarding: 'onboarding',
  order: 'order',
};

export const urls = {
  root: subRoutes.root,
  onboarding: `${subRoutes.root}/${subRoutes.onboarding}`,
  listing: `${subRoutes.root}`,
};
