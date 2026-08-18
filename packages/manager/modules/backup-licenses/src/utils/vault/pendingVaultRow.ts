import { PendingVaultRow, VaultRow } from '@/types/Vault.type';

export const isPendingVaultRow = (row: VaultRow): row is PendingVaultRow =>
  row.resourceStatus === 'PENDING';
