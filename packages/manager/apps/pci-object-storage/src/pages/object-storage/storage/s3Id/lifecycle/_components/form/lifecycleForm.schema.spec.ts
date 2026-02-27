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
  hasObjectSizeGreaterThan: false,
  objectSizeGreaterThan: 0,
  hasObjectSizeLessThan: false,
  objectSizeLessThan: 0,
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

  describe('tag key validation', () => {
    it('should reject a tag with empty key but non-empty value', () => {
      const result = schema.safeParse({
        ...baseData,
        hasFilter: true,
        tags: [{ key: '', value: 'some-value' }],
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.issues.find(
          (i) => i.path.includes('tags') && i.path.includes('key'),
        );
        expect(error?.message).toBe('formTagKeyRequired');
      }
    });

    it('should accept a tag with both key and value', () => {
      const result = schema.safeParse({
        ...baseData,
        hasFilter: true,
        tags: [{ key: 'env', value: 'prod' }],
      });
      expect(result.success).toBe(true);
    });

    it('should accept a tag with key only (empty value)', () => {
      const result = schema.safeParse({
        ...baseData,
        hasFilter: true,
        tags: [{ key: 'env', value: '' }],
      });
      expect(result.success).toBe(true);
    });

    it('should not validate tags when hasFilter is false', () => {
      const result = schema.safeParse({
        ...baseData,
        hasFilter: false,
        tags: [{ key: '', value: 'some-value' }],
      });
      expect(result.success).toBe(true);
    });
  });

  describe('object size filter validation', () => {
    it('should accept objectSizeGreaterThan alone > 0', () => {
      const result = schema.safeParse({
        ...baseData,
        hasFilter: true,
        hasObjectSizeGreaterThan: true,
        objectSizeGreaterThan: 1024,
        hasObjectSizeLessThan: false,
        objectSizeLessThan: 0,
      });
      expect(result.success).toBe(true);
    });

    it('should accept objectSizeLessThan alone > 0', () => {
      const result = schema.safeParse({
        ...baseData,
        hasFilter: true,
        hasObjectSizeGreaterThan: false,
        objectSizeGreaterThan: 0,
        hasObjectSizeLessThan: true,
        objectSizeLessThan: 1048576,
      });
      expect(result.success).toBe(true);
    });

    it('should reject when objectSizeGreaterThan >= objectSizeLessThan (both checked and > 0)', () => {
      const result = schema.safeParse({
        ...baseData,
        hasFilter: true,
        hasObjectSizeGreaterThan: true,
        objectSizeGreaterThan: 2048,
        hasObjectSizeLessThan: true,
        objectSizeLessThan: 1024,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.issues.find((i) =>
          i.path.includes('objectSizeGreaterThan'),
        );
        expect(error?.message).toBe('formObjectSizeRangeError');
      }
    });

    it('should reject when objectSizeGreaterThan equals objectSizeLessThan (both checked and > 0)', () => {
      const result = schema.safeParse({
        ...baseData,
        hasFilter: true,
        hasObjectSizeGreaterThan: true,
        objectSizeGreaterThan: 1024,
        hasObjectSizeLessThan: true,
        objectSizeLessThan: 1024,
      });
      expect(result.success).toBe(false);
    });

    it('should accept when objectSizeGreaterThan < objectSizeLessThan', () => {
      const result = schema.safeParse({
        ...baseData,
        hasFilter: true,
        hasObjectSizeGreaterThan: true,
        objectSizeGreaterThan: 1024,
        hasObjectSizeLessThan: true,
        objectSizeLessThan: 1048576,
      });
      expect(result.success).toBe(true);
    });

    it('should not validate size range when checkboxes are unchecked', () => {
      const result = schema.safeParse({
        ...baseData,
        hasFilter: true,
        hasObjectSizeGreaterThan: false,
        objectSizeGreaterThan: 2048,
        hasObjectSizeLessThan: false,
        objectSizeLessThan: 1024,
      });
      expect(result.success).toBe(true);
    });
  });
});
