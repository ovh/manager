export const instanceCreationMutationKey = (projectId: string): string[] => [
  'project',
  projectId,
  'instance_creation',
];
