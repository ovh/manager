export const networkQueryKey = (projectId: string, region: string): string[] => [
  'project',
  projectId,
  'network',
  region,
];
