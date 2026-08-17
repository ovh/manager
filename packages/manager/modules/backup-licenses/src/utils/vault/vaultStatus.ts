import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';

import { ResourceStatus } from '@/types/Resource.type';

export type VaultStatusLabel = 'active' | 'creating' | 'error';

/**
 * Ticket BKP-1221 maps the badge in three branches: READY → Active, PROVISIONING → Creating,
 * anything else → Error. `PROVISIONING` is not a member of `common.ResourceStatusEnum`; the real
 * value is `CREATING`, which is what the API sends and what is mapped here.
 */
export const VAULT_STATUS_LABEL: Record<ResourceStatus, VaultStatusLabel> = Object.freeze({
  READY: 'active',
  CREATING: 'creating',
  DELETING: 'error',
  ERROR: 'error',
  OUT_OF_SYNC: 'error',
  SUSPENDED: 'error',
  UNKNOWN: 'error',
  UPDATING: 'error',
});

const BADGE_COLOR: Record<VaultStatusLabel, ODS_BADGE_COLOR> = Object.freeze({
  active: ODS_BADGE_COLOR.success,
  creating: ODS_BADGE_COLOR.information,
  error: ODS_BADGE_COLOR.critical,
});

/** Keys of the shared `status` namespace whose values already read "Active"/"Creating"/"Error". */
const SHARED_STATUS_KEY: Record<VaultStatusLabel, string> = Object.freeze({
  active: 'ready',
  creating: 'creating',
  error: 'error',
});

export const getVaultStatusLabel = (resourceStatus: string): VaultStatusLabel =>
  VAULT_STATUS_LABEL[resourceStatus?.toUpperCase() as ResourceStatus] ?? 'error';

export const getVaultStatusBadgeColor = (resourceStatus: string): ODS_BADGE_COLOR =>
  BADGE_COLOR[getVaultStatusLabel(resourceStatus)];

export const getVaultStatusTranslationKey = (resourceStatus: string): string =>
  SHARED_STATUS_KEY[getVaultStatusLabel(resourceStatus)];
