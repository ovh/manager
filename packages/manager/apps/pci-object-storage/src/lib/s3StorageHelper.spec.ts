import { describe, it, expect } from 'vitest';
import { getAvailableStorageClasses } from './s3StorageHelper';
import storages from '@/types/Storages';

describe('s3StorageHelper', () => {
  describe('getAvailableStorageClasses', () => {
    it('should return all storage classes when no options are provided', () => {
      const result = getAvailableStorageClasses();

      expect(result).toContain(storages.StorageClassEnum.STANDARD);
      expect(result).toContain(storages.StorageClassEnum.STANDARD_IA);
      expect(result).toContain(storages.StorageClassEnum.DEEP_ARCHIVE);
    });

    it('should return all storage classes when is3AZ and isLZ are false', () => {
      const result = getAvailableStorageClasses({ is3AZ: false, isLZ: false });

      expect(result).toContain(storages.StorageClassEnum.STANDARD);
      expect(result).toContain(storages.StorageClassEnum.STANDARD_IA);
      expect(result).toContain(storages.StorageClassEnum.DEEP_ARCHIVE);
      expect(result).not.toContain(storages.StorageClassEnum.HIGH_PERF);
    });

    it('should exclude DEEP_ARCHIVE when is3AZ is true', () => {
      const result = getAvailableStorageClasses({ is3AZ: true });

      expect(result).toContain(storages.StorageClassEnum.STANDARD);
      expect(result).toContain(storages.StorageClassEnum.STANDARD_IA);
      expect(result).toContain(storages.StorageClassEnum.HIGH_PERF);
      expect(result).not.toContain(storages.StorageClassEnum.DEEP_ARCHIVE);
    });

    it('should include HIGH_PERF and exclude STANDARD_IA when isLZ is true', () => {
      const result = getAvailableStorageClasses({ isLZ: true });

      expect(result).toContain(storages.StorageClassEnum.STANDARD);
      expect(result).toContain(storages.StorageClassEnum.HIGH_PERF);
      expect(result).toContain(storages.StorageClassEnum.DEEP_ARCHIVE);
      expect(result).not.toContain(storages.StorageClassEnum.STANDARD_IA);
    });

    it('should include HIGH_PERF and exclude both DEEP_ARCHIVE and STANDARD_IA when both is3AZ and isLZ are true', () => {
      const result = getAvailableStorageClasses({ is3AZ: true, isLZ: true });

      expect(result).toContain(storages.StorageClassEnum.STANDARD);
      expect(result).toContain(storages.StorageClassEnum.HIGH_PERF);
      expect(result).not.toContain(storages.StorageClassEnum.DEEP_ARCHIVE);
      expect(result).not.toContain(storages.StorageClassEnum.STANDARD_IA);
    });

    it('should include HIGH_PERF when is3AZ is true and isLZ is false', () => {
      const result = getAvailableStorageClasses({ is3AZ: true, isLZ: false });

      expect(result).toContain(storages.StorageClassEnum.HIGH_PERF);
      expect(result).not.toContain(storages.StorageClassEnum.DEEP_ARCHIVE);
    });

    it('should include HIGH_PERF when is3AZ is false and isLZ is true', () => {
      const result = getAvailableStorageClasses({ is3AZ: false, isLZ: true });

      expect(result).toContain(storages.StorageClassEnum.HIGH_PERF);
      expect(result).not.toContain(storages.StorageClassEnum.STANDARD_IA);
    });

    it('should always include STANDARD storage class', () => {
      expect(getAvailableStorageClasses()).toContain(storages.StorageClassEnum.STANDARD);
      expect(getAvailableStorageClasses({ is3AZ: true })).toContain(storages.StorageClassEnum.STANDARD);
      expect(getAvailableStorageClasses({ isLZ: true })).toContain(storages.StorageClassEnum.STANDARD);
      expect(getAvailableStorageClasses({ is3AZ: true, isLZ: true })).toContain(storages.StorageClassEnum.STANDARD);
    });

    it('should return an array of StorageClassEnum values', () => {
      const result = getAvailableStorageClasses();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      result.forEach((storageClass) => {
        expect(Object.values(storages.StorageClassEnum)).toContain(storageClass);
      });
    });
  });
});
