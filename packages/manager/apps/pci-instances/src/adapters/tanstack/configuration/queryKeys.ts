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

export const privateNetworksQueryKey = (projectId: string): string[] => [
  'project',
  projectId,
  'privateNetworks',
];

export const floatingIpsQueryKey = (
  projectId: string,
  regionName: string,
): string[] => ['project', projectId, 'region', regionName, 'floatingIps'];
