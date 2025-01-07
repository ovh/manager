export const subRoutes = {
  onboarding: 'onboarding',
  installation: 'installation',
  serviceName: ':serviceName',
  initialStep: 'initialization',
  stepId: ':stepId',
};

export const urls = {
  root: `/`,
  listing: `/`,
  tab2: `Tab2`,
  onboarding: `/${subRoutes.onboarding}`,
  dashboard: `/${subRoutes.serviceName}`,
  installation: `/${subRoutes.installation}`,
  installationInitialStep: `/${subRoutes.installation}/${subRoutes.initialStep}`,
  installationStep: `/${subRoutes.installation}/${subRoutes.stepId}/${subRoutes.serviceName}`,
};
