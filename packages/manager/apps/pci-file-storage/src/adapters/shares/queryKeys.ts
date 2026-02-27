export const sharesQueryKey = (projectId: string, rest?: string[]): string[] => [
  'project',
  projectId,
  'shares',
  ...(rest && rest.length > 0 ? rest : []),
];

export const shareDetailsQueryKey = (
  projectId: string,
  region: string,
  shareId: string,
): string[] => ['project', projectId, 'share', region, shareId];
