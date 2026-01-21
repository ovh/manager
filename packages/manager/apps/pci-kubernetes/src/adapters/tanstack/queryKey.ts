export const queryKey = (projectId: string, options: Array<string>) => [
  'project',
  projectId,
  ...options,
];
