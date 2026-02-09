import { describe, expect, it } from 'vitest';

import { getShareStatusDisplay } from '../shareStatus.view-model';

describe('shareStatus view model', () => {
  describe('getShareStatusDisplay', () => {
    it.each([
      { status: 'available', labelKey: 'status:active', badgeColor: 'success' },
      { status: 'backup_creating', labelKey: 'status:backup_creating', badgeColor: 'warning' },
      { status: 'backup_restoring', labelKey: 'backup_restoring', badgeColor: 'warning' },
      { status: 'backup_restoring_error', labelKey: 'status:error', badgeColor: 'critical' },
      { status: 'creating', labelKey: 'status:creating', badgeColor: 'warning' },
      {
        status: 'creating_from_snapshot',
        labelKey: 'creating_from_snapshot',
        badgeColor: 'warning',
      },
      { status: 'deleting', labelKey: 'status:deleting', badgeColor: 'warning' },
      { status: 'error', labelKey: 'status:error', badgeColor: 'critical' },
      { status: 'error_deleting', labelKey: 'status:error', badgeColor: 'critical' },
      { status: 'extending', labelKey: 'status:extending', badgeColor: 'warning' },
      { status: 'inactive', labelKey: 'status:inactive', badgeColor: 'critical' },
      { status: 'deleted', labelKey: 'deleted', badgeColor: 'neutral' },
      { status: 'migrating', labelKey: 'migrating', badgeColor: 'neutral' },
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
});
