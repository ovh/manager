import { describe, expect, it } from 'vitest';

import { OdsBadgeColor } from '@ovhcloud/ods-components';

import { ApiResourceStatus } from '@/types/ApiGeneric.type';

import { getStatusBadgeColor } from './getStatusBadgeColor';

describe('getStatusBadgeColor', () => {
  const testCases: [ApiResourceStatus, OdsBadgeColor][] = [
    ['CREATING', 'information'],
    ['DELETING', 'critical'],
    ['ERROR', 'critical'],
    ['READY', 'success'],
    ['SUSPENDED', 'warning'],
    ['UPDATING', 'information'],
  ];

  it.each(testCases)('returns %s → %s', (status, expected) => {
    expect(getStatusBadgeColor(status)).toBe(expected);
  });

  it('returns "information" as fallback for invalid status', () => {
    expect(getStatusBadgeColor('INVALID' as ApiResourceStatus)).toBe('information');
  });
});
