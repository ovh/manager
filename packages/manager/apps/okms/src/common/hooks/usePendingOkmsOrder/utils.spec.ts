import { OKMS } from '@key-management-service/types/okms.type';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { findNewOkmsId, isOrderExpired } from './utils';

describe('isOrderExpired', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return true when order has expired', () => {
    const createdAt = '2025-11-12T10:00:00.000Z';
    const expirationInMinutes = 1;
    const now = new Date('2025-11-12T10:02:00.000Z').getTime(); // 2 minutes later

    vi.setSystemTime(now);

    const result = isOrderExpired(createdAt, expirationInMinutes);

    expect(result).toBe(true);
  });

  it('should return false when order has not expired', () => {
    const createdAt = '2025-11-12T10:00:00.000Z';
    const expirationInMinutes = 1;
    const now = new Date('2025-11-12T10:00:30.000Z').getTime(); // 30 seconds later

    vi.setSystemTime(now);

    const result = isOrderExpired(createdAt, expirationInMinutes);

    expect(result).toBe(false);
  });

  it('should return false when current time equals expiration time', () => {
    const createdAt = '2025-11-12T10:00:00.000Z';
    const expirationInMinutes = 1;
    const now = new Date('2025-11-12T10:01:00.000Z').getTime(); // Exactly 1 minute later

    vi.setSystemTime(now);

    const result = isOrderExpired(createdAt, expirationInMinutes);

    expect(result).toBe(false);
  });

  it('should return true when current time is just past expiration time', () => {
    const createdAt = '2025-11-12T10:00:00.000Z';
    const expirationInMinutes = 1;
    const now = new Date('2025-11-12T10:01:00.001Z').getTime(); // 1 millisecond past expiration

    vi.setSystemTime(now);

    const result = isOrderExpired(createdAt, expirationInMinutes);

    expect(result).toBe(true);
  });
});

describe('findNewOkmsId', () => {
  const mockOkms1: OKMS = {
    id: 'okms-1',
  } as OKMS;

  const mockOkms2: OKMS = {
    id: 'okms-2',
  } as OKMS;

  const mockOkms3: OKMS = {
    id: 'okms-3',
  } as OKMS;

  it('should return new OKMS when it exists in the list', () => {
    const initialOkmsIds = ['okms-1', 'okms-2'];
    const okmsList = [mockOkms1, mockOkms2, mockOkms3];

    const result = findNewOkmsId(initialOkmsIds, okmsList);

    expect(result).toEqual(mockOkms3);
  });

  it('should return undefined when no new OKMS exists', () => {
    const initialOkmsIds = ['okms-1', 'okms-2', 'okms-3'];
    const okmsList = [mockOkms1, mockOkms2, mockOkms3];

    const result = findNewOkmsId(initialOkmsIds, okmsList);

    expect(result).toBeUndefined();
  });

  it('should return undefined when OKMS list is empty', () => {
    const initialOkmsIds = ['okms-1', 'okms-2'];
    const okmsList: OKMS[] = [];

    const result = findNewOkmsId(initialOkmsIds, okmsList);

    expect(result).toBeUndefined();
  });

  it('should return the first new OKMS when multiple new ones exist', () => {
    const initialOkmsIds = ['okms-1'];
    const okmsList = [mockOkms1, mockOkms2, mockOkms3];

    const result = findNewOkmsId(initialOkmsIds, okmsList);

    expect(result).toEqual(mockOkms2);
  });
});
