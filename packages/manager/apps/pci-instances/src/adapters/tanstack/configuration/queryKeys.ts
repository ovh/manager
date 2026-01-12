export const sshKeysQueryKey = (projectId: string): string[] => [
  'project',
  projectId,
  'sshKeys',
];
