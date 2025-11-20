import { describe, it, expect } from 'vitest';
import { StorageObject } from '@datatr-ux/ovhcloud-types/cloud';
import { getTotalVersionsSize } from './s3ObjectHelper';

describe('getTotalVersionsSize', () => {
  it('should return 0 for empty array', () => {
    expect(getTotalVersionsSize([])).toBe(0);
  });

  it('should return the size of a single object', () => {
    const versions: StorageObject[] = [
      {
        etag: 'abc',
        key: 'file.txt',
        lastModified: '2025-11-06T12:00:00Z',
        size: 123,
      },
    ];
    expect(getTotalVersionsSize(versions)).toBe(123);
  });

  it('should sum the sizes of multiple objects', () => {
    const versions: StorageObject[] = [
      {
        etag: 'abc',
        key: 'file1.txt',
        lastModified: '2025-11-06T12:00:00Z',
        size: 100,
      },
      {
        etag: 'def',
        key: 'file2.txt',
        lastModified: '2025-11-06T13:00:00Z',
        size: 200,
      },
      {
        etag: 'ghi',
        key: 'file3.txt',
        lastModified: '2025-11-06T14:00:00Z',
        size: 300,
      },
    ];
    expect(getTotalVersionsSize(versions)).toBe(600);
  });

  it('should handle objects with size 0', () => {
    const versions: StorageObject[] = [
      {
        etag: 'abc',
        key: 'file.txt',
        lastModified: '2025-11-06T12:00:00Z',
        size: 0,
      },
    ];
    expect(getTotalVersionsSize(versions)).toBe(0);
  });
});
