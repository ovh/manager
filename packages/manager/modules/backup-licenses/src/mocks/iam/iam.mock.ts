import { IAM_ACTIONS } from '@/utils/iam.constants';

export const VAULT_IAM_ACTIONS = Object.values(IAM_ACTIONS);

export const getVaultIamUrn = (vaultId: string) =>
  `urn:v1:eu:resource:backupServices:vault:${vaultId}`;
