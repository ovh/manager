export const sshKeysQueryKey = (
  projectId: string,
  region: string,
): string[] => ['project', projectId, 'region', region, 'sshKeys'];
