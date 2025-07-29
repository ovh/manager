export const subRoutes = {
  onboarding: 'onboarding',
  listing: 'installations',
  serviceName: ':serviceName',
  initialStep: 'initialization',
  report: 'report',
  wizard: 'installation',
  stepId: ':stepId',
  taskId: ':taskId',
} as const;

export const urls = {
  root: `/`,
  dashboard: `/`,
  onboarding: `/${subRoutes.onboarding}`,
  listing: `/${subRoutes.listing}`,
  installationReport: `/${subRoutes.listing}/${subRoutes.report}`,
  installationWizard: `/${subRoutes.wizard}`,
  installationInitialStep: `/${subRoutes.wizard}/${subRoutes.initialStep}`,
  installationStep: `/${subRoutes.wizard}/${subRoutes.stepId}`,
} as const;
