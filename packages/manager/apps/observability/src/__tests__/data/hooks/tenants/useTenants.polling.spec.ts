import { describe, expect, it } from 'vitest';

import {
  POLLING_INTERVAL,
  POLLING_STATUSES,
  getPollingInterval,
  isPollingStatus,
} from '@/data/hooks/tenants/useTenants.polling';
import { TenantResourceStatus } from '@/types/tenants.type';

describe('useTenants.polling', () => {
  describe('POLLING_STATUSES', () => {
    it('should contain DELETING, UPDATING and CREATING statuses', () => {
      expect(POLLING_STATUSES).toContain('DELETING');
      expect(POLLING_STATUSES).toContain('UPDATING');
      expect(POLLING_STATUSES).toContain('CREATING');
    });

    it('should not contain stable statuses', () => {
      expect(POLLING_STATUSES).not.toContain('READY');
      expect(POLLING_STATUSES).not.toContain('ERROR');
      expect(POLLING_STATUSES).not.toContain('SUSPENDED');
      expect(POLLING_STATUSES).not.toContain('UNKNOWN');
    });
  });

  describe('isPollingStatus', () => {
    it.each([
      { status: 'DELETING' as TenantResourceStatus, expected: true },
      { status: 'UPDATING' as TenantResourceStatus, expected: true },
      { status: 'CREATING' as TenantResourceStatus, expected: true },
      { status: 'READY' as TenantResourceStatus, expected: false },
      { status: 'ERROR' as TenantResourceStatus, expected: false },
      { status: 'SUSPENDED' as TenantResourceStatus, expected: false },
      { status: 'UNKNOWN' as TenantResourceStatus, expected: false },
      { status: undefined, expected: false },
    ])('should return $expected for $status status', ({ status, expected }) => {
      expect(isPollingStatus(status)).toBe(expected);
    });
  });

  describe('getPollingInterval', () => {
    it.each([
      { status: 'DELETING' as TenantResourceStatus, expected: POLLING_INTERVAL },
      { status: 'UPDATING' as TenantResourceStatus, expected: POLLING_INTERVAL },
      { status: 'CREATING' as TenantResourceStatus, expected: POLLING_INTERVAL },
      { status: 'READY' as TenantResourceStatus, expected: false },
      { status: 'ERROR' as TenantResourceStatus, expected: false },
      { status: 'SUSPENDED' as TenantResourceStatus, expected: false },
      { status: 'UNKNOWN' as TenantResourceStatus, expected: false },
      { status: undefined, expected: false },
    ])('should return $expected for $status status', ({ status, expected }) => {
      expect(getPollingInterval(status)).toBe(expected);
    });
  });

  describe('POLLING_INTERVAL', () => {
    it('should be 5000ms', () => {
      expect(POLLING_INTERVAL).toBe(5000);
    });
  });
});
