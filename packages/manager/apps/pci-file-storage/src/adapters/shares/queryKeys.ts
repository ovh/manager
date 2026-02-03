export const sharesQueryKey = (projectId: string): string[] => ['project', projectId, 'shares'];

export const shareDetailsQueryKey = (
  projectId: string,
  region: string,
  shareId: string,
): string[] => ['project', projectId, 'share', region, shareId];
