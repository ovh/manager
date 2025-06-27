const getProjectIdUrl = (projectId: string) => `/pci/projects/${projectId}`;

export const getSavingsPlansListingUrl = (projectId: string) =>
  `${getProjectIdUrl(projectId)}/savings-plan/listing`;
