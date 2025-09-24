import { describe, expect, it } from 'vitest';
import { TStorage } from '@/api/data/storages';
import { isSwiftType } from '.';

describe('isSwiftType', () => {
  it('should return true if storage is not archive and does not have s3StorageType', () => {
    const storage = { archive: false, s3StorageType: null } as TStorage;
    const result = isSwiftType(storage);
    expect(result).toBe(true);
  });

  it('should return false if storage is archive', () => {
    const storage = { archive: true, s3StorageType: null } as TStorage;
    const result = isSwiftType(storage);
    expect(result).toBe(false);
  });

  it('should return false if storage has s3StorageType', () => {
    const storage = { archive: false, s3StorageType: 'someType' } as TStorage;
    const result = isSwiftType(storage);
    expect(result).toBe(false);
  });

  it('should return false if storage is archive and has s3StorageType', () => {
    const storage = { archive: true, s3StorageType: 'someType' } as TStorage;
    const result = isSwiftType(storage);
    expect(result).toBe(false);
  });
});
