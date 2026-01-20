export const sshKeysQueryKey = (projectId: string): string[] => [
  'project',
  projectId,
  'sshKeys',
];

export const backupConfigurationQueryKey = (projectId: string): string[] => [
  'project',
  projectId,
  'instanceBackup',
];
