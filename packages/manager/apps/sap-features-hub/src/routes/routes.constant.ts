export const subRoutes = {
  onboarding: 'onboarding',
  installation: 'installation',
  serviceName: ':serviceName',
  initialStep: 'initialization',
  stepId: ':stepId',
  taskId: ':taskId',
} as const;

export const urls = {
  root: `/`,
  dashboard: `/`,
  onboarding: `/${subRoutes.onboarding}`,
  installation: `/${subRoutes.installation}`,
  installationInitialStep: `/${subRoutes.installation}/${subRoutes.initialStep}`,
  installationStep: `/${subRoutes.installation}/${subRoutes.stepId}/${subRoutes.serviceName}`,
  installationDashboard: `/${subRoutes.serviceName}/${subRoutes.installation}/${subRoutes.taskId}`,
} as const;
