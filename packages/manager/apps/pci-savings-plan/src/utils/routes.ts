const getProjectIdUrl = (projectId: string) => `/pci/projects/${projectId}`;

export const getSavingsPlansUrl = (projectId: string) =>
  `${getProjectIdUrl(projectId)}/savings-plan`;

export const getOnboardingUrl = (projectId: string) =>
  `${getSavingsPlansUrl(projectId)}/onboarding`;

export const getCreateSavingsPlanUrl = (projectId: string) =>
  `${getSavingsPlansUrl(projectId)}/new`;
