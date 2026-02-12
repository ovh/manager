import { describe, it, expect } from 'vitest';
import {
  getDisabledStorageClasses,
  getRemainingStorageClasses,
  canAddTransition,
  getMaxTransitionDays,
  getNextTransitionDays,
} from './lifecycleTransition.utils';

describe('getDisabledStorageClasses', () => {
  it('should disable classes already used by other transitions', () => {
    const transitions = [
      { storageClass: 'STANDARD_IA' },
      { storageClass: 'GLACIER_IR' },
    ];
    const disabled = getDisabledStorageClasses(transitions, 0);
    expect(disabled.has('GLACIER_IR')).toBe(true);
  });

  it('should disable classes with a tier lower than or equal to the max previous tier', () => {
    const transitions = [{ storageClass: 'GLACIER_IR' }, { storageClass: '' }];
    // At index 1, previous transitions have GLACIER_IR (tier 1)
    // STANDARD_IA (tier 0) and GLACIER_IR (tier 1) should be disabled
    const disabled = getDisabledStorageClasses(transitions, 1);
    expect(disabled.has('STANDARD_IA')).toBe(true);
    expect(disabled.has('GLACIER_IR')).toBe(true);
    expect(disabled.has('DEEP_ARCHIVE')).toBe(false);
  });

  it('should return empty set for single transition at index 0', () => {
    const transitions = [{ storageClass: '' }];
    const disabled = getDisabledStorageClasses(transitions, 0);
    expect(disabled.size).toBe(0);
  });

  it('should combine both used-by-others and tier-based disabling', () => {
    const transitions = [
      { storageClass: 'STANDARD_IA' },
      { storageClass: '' },
      { storageClass: 'DEEP_ARCHIVE' },
    ];
    // At index 1: STANDARD_IA is used by index 0, DEEP_ARCHIVE is used by index 2
    // Previous tiers (index 0): max tier = 0 (STANDARD_IA)
    // Disabled: STANDARD_IA (used + tier <= 0), DEEP_ARCHIVE (used)
    const disabled = getDisabledStorageClasses(transitions, 1);
    expect(disabled.has('STANDARD_IA')).toBe(true);
    expect(disabled.has('DEEP_ARCHIVE')).toBe(true);
    expect(disabled.has('GLACIER_IR')).toBe(false);
  });
});

describe('getRemainingStorageClasses', () => {
  it('should return all classes when no transitions exist', () => {
    const remaining = getRemainingStorageClasses([]);
    expect(remaining).toEqual(['STANDARD_IA', 'GLACIER_IR', 'DEEP_ARCHIVE']);
  });

  it('should exclude used classes and lower-tier classes', () => {
    const transitions = [{ storageClass: 'STANDARD_IA' }];
    const remaining = getRemainingStorageClasses(transitions);
    expect(remaining).toEqual(['GLACIER_IR', 'DEEP_ARCHIVE']);
  });

  it('should return only higher-tier classes after GLACIER_IR', () => {
    const transitions = [
      { storageClass: 'STANDARD_IA' },
      { storageClass: 'GLACIER_IR' },
    ];
    const remaining = getRemainingStorageClasses(transitions);
    expect(remaining).toEqual(['DEEP_ARCHIVE']);
  });

  it('should return empty when all classes are used', () => {
    const transitions = [
      { storageClass: 'STANDARD_IA' },
      { storageClass: 'GLACIER_IR' },
      { storageClass: 'DEEP_ARCHIVE' },
    ];
    const remaining = getRemainingStorageClasses(transitions);
    expect(remaining).toEqual([]);
  });

  it('should ignore empty storageClass values', () => {
    const transitions = [{ storageClass: '' }];
    const remaining = getRemainingStorageClasses(transitions);
    // maxUsedTier is -1 (empty string has no tier), all classes have tier > -1
    expect(remaining).toEqual(['STANDARD_IA', 'GLACIER_IR', 'DEEP_ARCHIVE']);
  });
});

describe('canAddTransition', () => {
  it('should return true when there are remaining classes', () => {
    expect(canAddTransition([])).toBe(true);
    expect(canAddTransition([{ storageClass: 'STANDARD_IA' }])).toBe(true);
  });

  it('should return false when all classes are used', () => {
    const transitions = [
      { storageClass: 'STANDARD_IA' },
      { storageClass: 'GLACIER_IR' },
      { storageClass: 'DEEP_ARCHIVE' },
    ];
    expect(canAddTransition(transitions)).toBe(false);
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
