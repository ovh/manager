const getProjectIdUrl = (projectId: string) => `/pci/projects/${projectId}`;

export const getSavingsPlansUrl = (projectId: string) =>
  `${getProjectIdUrl(projectId)}/savings-plan`;

export const getSavingsPlansListingUrl = (projectId: string) =>
  `${getProjectIdUrl(projectId)}/savings-plan/listing`;

export const getOnboardingUrl = (projectId: string) =>
  `${getSavingsPlansUrl(projectId)}/onboarding`;

export const getCreateSavingsPlanUrl = (projectId: string) =>
  `${getSavingsPlansUrl(projectId)}/new`;
