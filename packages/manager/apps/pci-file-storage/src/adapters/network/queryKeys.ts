export const networkQueryKey = (projectId: string, region: string): string[] => [
  'project',
  projectId,
  'network',
  region,
];

export const subnetQueryKey = (projectId: string, region: string, networkId: string): string[] => [
  'project',
  projectId,
  'network',
  region,
  networkId,
  'subnet',
];
