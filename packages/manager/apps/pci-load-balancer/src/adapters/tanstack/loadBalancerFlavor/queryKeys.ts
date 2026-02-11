export const loadBalancerFlavorsQueryKey = (projectId: string, region: string) => [
  'project',
  projectId,
  'region',
  region,
  'loadBalancerFlavors',
];
