export const networksQueryKey = (projectId: string, region: string): string[] => [
  'project',
  projectId,
  'network',
  region,
];

export const networkQueryKey = (projectId: string, region: string, networkId: string): string[] => [
  'project',
  projectId,
  'network',
  region,
  networkId,
];

export const subnetQueryKey = (projectId: string, region: string, networkId: string): string[] => [
  'project',
  projectId,
  'network',
  region,
  networkId,
  'subnet',
];
