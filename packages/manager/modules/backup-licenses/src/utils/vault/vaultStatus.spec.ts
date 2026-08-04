import { describe, expect, it, vi } from 'vitest';

import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';

import { ResourceStatus } from '@/types/Resource.type';

import {
  VAULT_STATUS_LABEL,
  getVaultStatusBadgeColor,
  getVaultStatusLabel,
  getVaultStatusTranslationKey,
} from './vaultStatus';

vi.mock('@ovhcloud/ods-components', () => ({
  ODS_BADGE_COLOR: {
    information: 'information',
    critical: 'critical',
    success: 'success',
    warning: 'warning',
  },
}));

const ALL_STATUSES: ResourceStatus[] = [
  'CREATING',
  'DELETING',
  'ERROR',
  'OUT_OF_SYNC',
  'READY',
  'SUSPENDED',
  'UNKNOWN',
  'UPDATING',
];

describe('getVaultStatusLabel', () => {
  it('covers every status of the API enum', () => {
    expect(Object.keys(VAULT_STATUS_LABEL).sort()).toEqual([...ALL_STATUSES].sort());
  });

  it.each([
    ['READY', 'active'],
    ['CREATING', 'creating'],
  ])('maps %s to %s', (status, label) => {
    expect(getVaultStatusLabel(status)).toBe(label);
  });

  it.each(['DELETING', 'ERROR', 'OUT_OF_SYNC', 'SUSPENDED', 'UNKNOWN', 'UPDATING'])(
    'maps %s to error, as the ticket collapses everything but READY and CREATING',
    (status) => {
      expect(getVaultStatusLabel(status)).toBe('error');
    },
  );

  it('degrades to error on an unknown status', () => {
    expect(getVaultStatusLabel('HIBERNATING')).toBe('error');
  });
});

describe('getVaultStatusBadgeColor', () => {
  it.each([
    ['READY', ODS_BADGE_COLOR.success],
    ['CREATING', ODS_BADGE_COLOR.information],
    ['SUSPENDED', ODS_BADGE_COLOR.critical],
  ])('renders %s as %s', (status, color) => {
    expect(getVaultStatusBadgeColor(status)).toBe(color);
  });
});

describe('getVaultStatusTranslationKey', () => {
  it.each([
    ['READY', 'ready'],
    ['CREATING', 'creating'],
    ['OUT_OF_SYNC', 'error'],
    ['HIBERNATING', 'error'],
  ])('resolves %s to the shared status key "%s"', (status, key) => {
    expect(getVaultStatusTranslationKey(status)).toBe(key);
  });
});
