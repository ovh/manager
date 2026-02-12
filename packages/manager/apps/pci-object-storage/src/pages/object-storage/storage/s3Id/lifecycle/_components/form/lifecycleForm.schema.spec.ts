import { describe, it, expect } from 'vitest';
import { createLifecycleSchema } from './lifecycleForm.schema';

const mockT = (key: string) => key;
const schema = createLifecycleSchema(mockT);

const baseData = {
  ruleId: 'test-rule',
  status: 'enabled' as const,
  hasFilter: false,
  prefix: '',
  tags: [] as { key: string; value: string }[],
  hasCurrentVersionTransitions: false,
  transitions: [] as { days: number; storageClass: string }[],
  hasCurrentVersionExpiration: false,
  expirationDays: 0,
  expiredObjectDeleteMarker: false,
  hasNoncurrentVersionTransitions: false,
  noncurrentVersionTransitions: [] as {
    noncurrentDays: number;
    storageClass: string;
  }[],
  hasNoncurrentVersionExpiration: false,
  noncurrentVersionExpirationDays: 0,
  hasAbortIncompleteMultipartUpload: false,
  abortDaysAfterInitiation: 0,
};

describe('createLifecycleSchema', () => {
  it('should accept valid base data', () => {
    const result = schema.safeParse(baseData);
    expect(result.success).toBe(true);
  });

  it('should require ruleId', () => {
    const result = schema.safeParse({ ...baseData, ruleId: '' });
    expect(result.success).toBe(false);
  });

  describe('current version transitions - min 30 days', () => {
    it('should reject a transition with days < 30', () => {
      const result = schema.safeParse({
        ...baseData,
        hasCurrentVersionTransitions: true,
        transitions: [{ days: 10, storageClass: 'STANDARD_IA' }],
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const daysError = result.error.issues.find(
          (i) => i.path.includes('days') && i.path.includes(0),
        );
        expect(daysError).toBeDefined();
      }
    });

    it('should accept a transition with days = 30', () => {
      const result = schema.safeParse({
        ...baseData,
        hasCurrentVersionTransitions: true,
        transitions: [{ days: 30, storageClass: 'STANDARD_IA' }],
      });
      expect(result.success).toBe(true);
    });
  });

  describe('current version transitions - 30-day gap between consecutive transitions', () => {
    it('should reject transitions with less than 30-day gap (sorted by tier)', () => {
      const result = schema.safeParse({
        ...baseData,
        hasCurrentVersionTransitions: true,
        transitions: [
          { days: 30, storageClass: 'STANDARD_IA' },
          { days: 40, storageClass: 'GLACIER_IR' },
        ],
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const gapError = result.error.issues.find(
          (i) => i.message === 'formTransitionMinGapError',
        );
        expect(gapError).toBeDefined();
      }
    });

    it('should accept transitions with exactly 30-day gap', () => {
      const result = schema.safeParse({
        ...baseData,
        hasCurrentVersionTransitions: true,
        transitions: [
          { days: 30, storageClass: 'STANDARD_IA' },
          { days: 60, storageClass: 'GLACIER_IR' },
        ],
      });
      expect(result.success).toBe(true);
    });

    it('should accept transitions with more than 30-day gap', () => {
      const result = schema.safeParse({
        ...baseData,
        hasCurrentVersionTransitions: true,
        transitions: [
          { days: 30, storageClass: 'STANDARD_IA' },
          { days: 90, storageClass: 'GLACIER_IR' },
          { days: 120, storageClass: 'DEEP_ARCHIVE' },
        ],
      });
      expect(result.success).toBe(true);
    });

    it('should sort transitions by tier before validating gap', () => {
      // Transitions entered in reverse tier order but with valid gaps when sorted
      const result = schema.safeParse({
        ...baseData,
        hasCurrentVersionTransitions: true,
        transitions: [
          { days: 60, storageClass: 'GLACIER_IR' },
          { days: 30, storageClass: 'STANDARD_IA' },
        ],
      });
      expect(result.success).toBe(true);
    });
  });

  describe('noncurrent version transitions - min 30 days', () => {
    it('should reject a noncurrent transition with days < 30', () => {
      const result = schema.safeParse({
        ...baseData,
        hasNoncurrentVersionTransitions: true,
        noncurrentVersionTransitions: [
          { noncurrentDays: 15, storageClass: 'STANDARD_IA' },
        ],
      });
      expect(result.success).toBe(false);
    });

    it('should accept a noncurrent transition with days = 30', () => {
      const result = schema.safeParse({
        ...baseData,
        hasNoncurrentVersionTransitions: true,
        noncurrentVersionTransitions: [
          { noncurrentDays: 30, storageClass: 'STANDARD_IA' },
        ],
      });
      expect(result.success).toBe(true);
    });
  });

  describe('noncurrent version transitions - 30-day gap', () => {
    it('should reject noncurrent transitions with less than 30-day gap', () => {
      const result = schema.safeParse({
        ...baseData,
        hasNoncurrentVersionTransitions: true,
        noncurrentVersionTransitions: [
          { noncurrentDays: 30, storageClass: 'STANDARD_IA' },
          { noncurrentDays: 50, storageClass: 'GLACIER_IR' },
        ],
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const gapError = result.error.issues.find(
          (i) => i.message === 'formTransitionMinGapError',
        );
        expect(gapError).toBeDefined();
      }
    });

    it('should accept noncurrent transitions with valid gaps', () => {
      const result = schema.safeParse({
        ...baseData,
        hasNoncurrentVersionTransitions: true,
        noncurrentVersionTransitions: [
          { noncurrentDays: 30, storageClass: 'STANDARD_IA' },
          { noncurrentDays: 60, storageClass: 'GLACIER_IR' },
        ],
      });
      expect(result.success).toBe(true);
    });
  });

  describe('expiration must be greater than max transition days', () => {
    it('should reject expirationDays <= max transition days', () => {
      const result = schema.safeParse({
        ...baseData,
        hasCurrentVersionTransitions: true,
        transitions: [
          { days: 30, storageClass: 'STANDARD_IA' },
          { days: 60, storageClass: 'GLACIER_IR' },
        ],
        hasCurrentVersionExpiration: true,
        expirationDays: 60,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.issues.find((i) =>
          i.path.includes('expirationDays'),
        );
        expect(error?.message).toBe('formExpirationAfterTransitionsError');
      }
    });

    it('should accept expirationDays > max transition days', () => {
      const result = schema.safeParse({
        ...baseData,
        hasCurrentVersionTransitions: true,
        transitions: [
          { days: 30, storageClass: 'STANDARD_IA' },
          { days: 60, storageClass: 'GLACIER_IR' },
        ],
        hasCurrentVersionExpiration: true,
        expirationDays: 61,
      });
      expect(result.success).toBe(true);
    });

    it('should not validate when hasCurrentVersionTransitions is false', () => {
      const result = schema.safeParse({
        ...baseData,
        hasCurrentVersionTransitions: false,
        transitions: [{ days: 90, storageClass: 'STANDARD_IA' }],
        hasCurrentVersionExpiration: true,
        expirationDays: 30,
      });
      expect(result.success).toBe(true);
    });

    it('should not validate when hasCurrentVersionExpiration is false', () => {
      const result = schema.safeParse({
        ...baseData,
        hasCurrentVersionTransitions: true,
        transitions: [{ days: 60, storageClass: 'STANDARD_IA' }],
        hasCurrentVersionExpiration: false,
        expirationDays: 30,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('noncurrent expiration must be greater than max noncurrent transition days', () => {
    it('should reject noncurrentVersionExpirationDays <= max noncurrent transition days', () => {
      const result = schema.safeParse({
        ...baseData,
        hasNoncurrentVersionTransitions: true,
        noncurrentVersionTransitions: [
          { noncurrentDays: 30, storageClass: 'STANDARD_IA' },
          { noncurrentDays: 60, storageClass: 'GLACIER_IR' },
        ],
        hasNoncurrentVersionExpiration: true,
        noncurrentVersionExpirationDays: 60,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.issues.find((i) =>
          i.path.includes('noncurrentVersionExpirationDays'),
        );
        expect(error?.message).toBe('formExpirationAfterTransitionsError');
      }
    });

    it('should accept noncurrentVersionExpirationDays > max noncurrent transition days', () => {
      const result = schema.safeParse({
        ...baseData,
        hasNoncurrentVersionTransitions: true,
        noncurrentVersionTransitions: [
          { noncurrentDays: 30, storageClass: 'STANDARD_IA' },
          { noncurrentDays: 60, storageClass: 'GLACIER_IR' },
        ],
        hasNoncurrentVersionExpiration: true,
        noncurrentVersionExpirationDays: 90,
      });
      expect(result.success).toBe(true);
    });
  });

  it('should not validate gaps when hasCurrentVersionTransitions is false', () => {
    const result = schema.safeParse({
      ...baseData,
      hasCurrentVersionTransitions: false,
      transitions: [
        { days: 30, storageClass: 'STANDARD_IA' },
        { days: 31, storageClass: 'GLACIER_IR' },
      ],
    });
    expect(result.success).toBe(true);
  });

  it('should not validate gaps when hasNoncurrentVersionTransitions is false', () => {
    const result = schema.safeParse({
      ...baseData,
      hasNoncurrentVersionTransitions: false,
      noncurrentVersionTransitions: [
        { noncurrentDays: 30, storageClass: 'STANDARD_IA' },
        { noncurrentDays: 31, storageClass: 'GLACIER_IR' },
      ],
    });
    expect(result.success).toBe(true);
  });
});
