const getProjectIdUrl = (projectId: string) => `/pci/projects/${projectId}`;

export const getActivateDiscoveryUrl = (projectId: string) =>
  `${getProjectIdUrl(projectId)}/activate`;

export const getRanchersUrl = (projectId: string) =>
  `${getProjectIdUrl(projectId)}/rancher`;

export const getRancherByIdUrl = (projectId: string, rancherId: string) =>
  `${getProjectIdUrl(projectId)}/rancher/${rancherId}`;

export const getOnboardingUrl = (projectId: string) =>
  `${getRanchersUrl(projectId)}/onboarding`;

export const getCreateRancherUrl = (projectId: string) =>
  `${getRanchersUrl(projectId)}/new`;

export const getUpdateSoftwareUrl = (projectId: string, rancherId: string) =>
  `${getRanchersUrl(projectId)}/rancher/${rancherId}/update-software`;
