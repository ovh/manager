export const aclsQueryKey = (projectId: string, region: string, shareId: string): string[] => [
  'project',
  projectId,
  'share',
  region,
  shareId,
  'acls',
];
