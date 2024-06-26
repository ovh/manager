const getProjectIdUrl = (projectId: string) => `/pci/projects/${projectId}`;

export const getActivateDiscoveryUrl = (projectId: string) =>
  `${getProjectIdUrl(projectId)}/activate`;

export const getSavingsPlansUrl = (projectId: string) =>
  `${getProjectIdUrl(projectId)}/savings-plan`;

export const getSavingsPlanByIdUrl = (projectId: string, savingsPlanId: string) =>
  `${getProjectIdUrl(projectId)}/savings-plan/${savingsPlanId}`;

export const getOnboardingUrl = (projectId: string) =>
  `${getSavingsPlansUrl(projectId)}/onboarding`;

export const getCreateSavingsPlanUrl = (projectId: string) =>
  `${getSavingsPlansUrl(projectId)}/new`;

export const getUpdateSoftwareUrl = (projectId: string, savingsPlanId: string) =>
  `${getSavingsPlansUrl(projectId)}/savings-plan/${savingsPlanId}/update-software`;
