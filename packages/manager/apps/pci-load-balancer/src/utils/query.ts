export const queryKeyBuilder = (
  projectId: string,
  region: string,
  rest?: string[],
): string[] => [
  'project',
  projectId,
  'region',
  region,
  ...(rest && rest.length > 0 ? rest : []),
];
