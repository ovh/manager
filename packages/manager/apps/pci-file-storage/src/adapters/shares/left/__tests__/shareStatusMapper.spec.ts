import { describe, expect, it } from 'vitest';

import { getShareStatusDisplay } from '../shareStatusMapper';

describe('getShareStatusDisplay', () => {
  it.each([
    { status: 'available', labelKey: 'list:status.active', badgeColor: 'success' },
    { status: 'creating', labelKey: 'list:status.pending', badgeColor: 'warning' },
    { status: 'error', labelKey: 'list:status.error', badgeColor: 'critical' },
    { status: 'deleting', labelKey: 'list:status.pending', badgeColor: 'warning' },
    { status: 'deleted', labelKey: 'list:status.na', badgeColor: 'neutral' },
    { status: 'backup_creating', labelKey: 'list:status.pending', badgeColor: 'warning' },
    { status: 'unknown_status', labelKey: 'unknown_status', badgeColor: 'neutral' },
  ])(
    'should map status "$status" to $labelKey with $badgeColor',
    ({ status, labelKey, badgeColor }) => {
      const result = getShareStatusDisplay(status);

      expect(result).toEqual({
        labelKey,
        badgeColor,
      });
    },
  );
});
