import { describe, it, expect } from 'vitest';
import storages from '@/types/Storages';
import {
  getDisabledStorageClasses,
  getRemainingStorageClasses,
  canAddTransition,
  getMaxTransitionDays,
  getNextTransitionDays,
} from './lifecycleTransition.utils';

const { StorageClassEnum } = storages;

const AVAILABLE_CLASSES = [
  StorageClassEnum.STANDARD_IA,
  StorageClassEnum.GLACIER_IR,
  StorageClassEnum.DEEP_ARCHIVE,
];

describe('getDisabledStorageClasses', () => {
  it('should disable classes already used by other transitions', () => {
    const transitions = [
      { storageClass: StorageClassEnum.STANDARD_IA },
      { storageClass: StorageClassEnum.GLACIER_IR },
    ];
    const disabled = getDisabledStorageClasses(
      AVAILABLE_CLASSES,
      transitions,
      0,
    );
    expect(disabled.has(StorageClassEnum.GLACIER_IR)).toBe(true);
  });

  it('should disable classes with a tier lower than or equal to the max previous tier', () => {
    const transitions = [
      { storageClass: StorageClassEnum.GLACIER_IR },
      { storageClass: undefined },
    ];
    const disabled = getDisabledStorageClasses(
      AVAILABLE_CLASSES,
      transitions,
      1,
    );
    expect(disabled.has(StorageClassEnum.STANDARD_IA)).toBe(true);
    expect(disabled.has(StorageClassEnum.GLACIER_IR)).toBe(true);
    expect(disabled.has(StorageClassEnum.DEEP_ARCHIVE)).toBe(false);
  });

  it('should return empty set for single transition at index 0', () => {
    const transitions: { storageClass?: storages.StorageClassEnum }[] = [
      { storageClass: undefined },
    ];
    const disabled = getDisabledStorageClasses(
      AVAILABLE_CLASSES,
      transitions,
      0,
    );
    expect(disabled.size).toBe(0);
  });

  it('should combine both used-by-others and tier-based disabling', () => {
    const transitions = [
      { storageClass: StorageClassEnum.STANDARD_IA },
      { storageClass: undefined },
      { storageClass: StorageClassEnum.DEEP_ARCHIVE },
    ];
    const disabled = getDisabledStorageClasses(
      AVAILABLE_CLASSES,
      transitions,
      1,
    );
    expect(disabled.has(StorageClassEnum.STANDARD_IA)).toBe(true);
    expect(disabled.has(StorageClassEnum.DEEP_ARCHIVE)).toBe(true);
    expect(disabled.has(StorageClassEnum.GLACIER_IR)).toBe(false);
  });

  it('should only consider classes in availableStorageClasses', () => {
    const limitedClasses = [
      StorageClassEnum.STANDARD_IA,
      StorageClassEnum.DEEP_ARCHIVE,
    ];
    const transitions: { storageClass?: storages.StorageClassEnum }[] = [
      { storageClass: undefined },
    ];
    const disabled = getDisabledStorageClasses(limitedClasses, transitions, 0);
    expect(disabled.size).toBe(0);
  });
});

describe('getRemainingStorageClasses', () => {
  it('should return all classes when no transitions exist', () => {
    const remaining = getRemainingStorageClasses(AVAILABLE_CLASSES, []);
    expect(remaining).toEqual([
      StorageClassEnum.STANDARD_IA,
      StorageClassEnum.GLACIER_IR,
      StorageClassEnum.DEEP_ARCHIVE,
    ]);
  });

  it('should exclude used classes and lower-tier classes', () => {
    const transitions = [{ storageClass: StorageClassEnum.STANDARD_IA }];
    const remaining = getRemainingStorageClasses(
      AVAILABLE_CLASSES,
      transitions,
    );
    expect(remaining).toEqual([
      StorageClassEnum.GLACIER_IR,
      StorageClassEnum.DEEP_ARCHIVE,
    ]);
  });

  it('should return only higher-tier classes after GLACIER_IR', () => {
    const transitions = [
      { storageClass: StorageClassEnum.STANDARD_IA },
      { storageClass: StorageClassEnum.GLACIER_IR },
    ];
    const remaining = getRemainingStorageClasses(
      AVAILABLE_CLASSES,
      transitions,
    );
    expect(remaining).toEqual([StorageClassEnum.DEEP_ARCHIVE]);
  });

  it('should return empty when all classes are used', () => {
    const transitions = [
      { storageClass: StorageClassEnum.STANDARD_IA },
      { storageClass: StorageClassEnum.GLACIER_IR },
      { storageClass: StorageClassEnum.DEEP_ARCHIVE },
    ];
    const remaining = getRemainingStorageClasses(
      AVAILABLE_CLASSES,
      transitions,
    );
    expect(remaining).toEqual([]);
  });

  it('should ignore undefined storageClass values', () => {
    const transitions: { storageClass?: storages.StorageClassEnum }[] = [
      { storageClass: undefined },
    ];
    const remaining = getRemainingStorageClasses(
      AVAILABLE_CLASSES,
      transitions,
    );
    expect(remaining).toEqual([
      StorageClassEnum.STANDARD_IA,
      StorageClassEnum.GLACIER_IR,
      StorageClassEnum.DEEP_ARCHIVE,
    ]);
  });

  it('should only return classes present in availableStorageClasses', () => {
    const limitedClasses = [StorageClassEnum.STANDARD_IA];
    const remaining = getRemainingStorageClasses(limitedClasses, []);
    expect(remaining).toEqual([StorageClassEnum.STANDARD_IA]);
  });
});

describe('canAddTransition', () => {
  it('should return true when there are remaining classes', () => {
    expect(canAddTransition(AVAILABLE_CLASSES, [])).toBe(true);
    expect(
      canAddTransition(AVAILABLE_CLASSES, [
        { storageClass: StorageClassEnum.STANDARD_IA },
      ]),
    ).toBe(true);
  });

  it('should return false when all classes are used', () => {
    const transitions = [
      { storageClass: StorageClassEnum.STANDARD_IA },
      { storageClass: StorageClassEnum.GLACIER_IR },
      { storageClass: StorageClassEnum.DEEP_ARCHIVE },
    ];
    expect(canAddTransition(AVAILABLE_CLASSES, transitions)).toBe(false);
  });

  it('should return false when available classes is empty', () => {
    expect(canAddTransition([], [])).toBe(false);
  });
});

describe('getMaxTransitionDays', () => {
  it('should return 0 when no transitions exist', () => {
    expect(getMaxTransitionDays([])).toBe(0);
  });

  it('should return the max days value', () => {
    const transitions = [{ days: 30 }, { days: 90 }, { days: 60 }];
    expect(getMaxTransitionDays(transitions)).toBe(90);
  });

  it('should handle undefined days as 0', () => {
    const transitions = [{ days: 60 }, { days: undefined }];
    expect(getMaxTransitionDays(transitions)).toBe(60);
  });
});

describe('getNextTransitionDays', () => {
  it('should return MIN_TRANSITION_GAP_DAYS when no transitions exist', () => {
    expect(getNextTransitionDays([])).toBe(30);
  });

  it('should return last transition days + 30', () => {
    const transitions = [{ days: 30 }];
    expect(getNextTransitionDays(transitions)).toBe(60);
  });

  it('should use the last transition in the array', () => {
    const transitions = [{ days: 30 }, { days: 60 }];
    expect(getNextTransitionDays(transitions)).toBe(90);
  });
});
