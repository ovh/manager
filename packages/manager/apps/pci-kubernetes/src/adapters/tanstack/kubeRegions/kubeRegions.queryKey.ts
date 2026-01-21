export const getKubeRegionsQueryKey = (projectId: string) => [
  'kube-roject',
  projectId,
  'capabilities',
  'kube',
  'regions',
];
