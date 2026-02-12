export const operationsQueryKey = (projectId: string): string[] => [
  'project',
  projectId,
  'operations',
];

export const operationQueryKey = (
  projectId: string,
  operationId: string,
): string[] => ['project', projectId, 'operation', operationId];
